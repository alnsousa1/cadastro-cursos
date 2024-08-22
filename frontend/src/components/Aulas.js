import Swal from 'sweetalert2'; // Importe o SweetAlert
import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; // Adicione a importação dos ícones

function Aulas() {
  const { moduloId, cursoId } = useParams(); // Pegue moduloId e cursoId dos parâmetros da URL
  const navigate = useNavigate();
  const [aulas, setAulas] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [linkAula, setLinkAula] = useState('');
  const [id, setId] = useState(null);
  const [token, setToken] = useState(''); // Adicione lógica para obter o token, se necessário
  const [search, setSearch] = useState(''); // Estado para busca
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState('nome'); // Estado para coluna de ordenação
  const [sortOrder, setSortOrder] = useState('asc'); // Estado para ordem de ordenação

  useEffect(() => {
    if (moduloId) {
      buscarAulas();
    }
  }, [moduloId]);

  const buscarAulas = () => {
    fetch(`http://localhost:8000/api/v1/cursos/${cursoId}/modulos/${moduloId}/aulas`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(response => {
        setAulas(response.data);
      });
  };

  const filteredAulas = aulas.filter(aula => aula.nome.toLowerCase().includes(search.toLowerCase()));

  const sortedAulas = filteredAulas.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (a[sortColumn] > b[sortColumn]) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedAulas = Array.from(sortedAulas);
    const [moved] = reorderedAulas.splice(result.source.index, 1);
    reorderedAulas.splice(result.destination.index, 0, moved);

    setAulas(reorderedAulas);
    // Implementar lógica para atualizar a ordem no backend, se necessário
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Resetar para a primeira página quando a busca mudar
  };

  const indexOfLastAula = currentPage * itemsPerPage;
  const indexOfFirstAula = indexOfLastAula - itemsPerPage;
  const currentAulas = sortedAulas.slice(indexOfFirstAula, indexOfLastAula);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const cadastraAula = () => {
    if (!nome || !descricao || !linkAula) {
      Swal.fire('Erro', 'Por favor, preencha todos os campos.', 'error');
      return;
    }

    const metodo = id ? 'PUT' : 'POST';
    const url = id
      ? `http://localhost:8000/api/v1/aulas/${id}`
      : `http://localhost:8000/api/v1/modulos/${moduloId}/aulas`;

    fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nome, descricao, link_aula: linkAula, curso_id: cursoId })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(id ? 'Não foi possível editar a aula' : 'Não foi possível adicionar a aula');
        }
      })
      .then(data => {
        if (id) {
          setAulas(aulas.map(aula => aula.id === id ? data : aula));
          Swal.fire('Sucesso', 'Aula editada com sucesso!', 'success');
        } else {
          setAulas([...aulas, data]);
          Swal.fire('Sucesso', 'Aula cadastrada com sucesso!', 'success');
        }
        fecharModal();
      })
      .catch(error => Swal.fire('Erro', error.message, 'error'));
  };

  const editarAula = (id) => {
    fetch(`http://localhost:8000/api/v1/aulas/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(response => {
        setId(response.data.id);
        setNome(response.data.nome);
        setDescricao(response.data.descricao);
        setLinkAula(response.data.link_aula);
        abrirModal();
      });
  };

  const deletarAula = (id) => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8000/api/v1/aulas/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            if (response.ok) {
              setAulas(aulas.filter(aula => aula.id !== id));
              Swal.fire('Excluída!', 'A aula foi excluída.', 'success');
            } else {
              throw new Error('Não foi possível excluir a aula');
            }
          })
          .catch(error => Swal.fire('Erro', error.message, 'error'));
      }
    });
  };

  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setNome('');
    setDescricao('');
    setLinkAula('');
    setId(null);
  };

  return (
    <div className='m-3'>
      <Button variant="primary" type="button" onClick={abrirModal} style={{ marginBottom: '20px' }}>
        Novo
      </Button>
      <Modal show={modalAberto} onHide={fecharModal}>
        <Modal.Header closeButton>
          <Modal.Title>{id ? 'Editar Aula' : 'Cadastro de Aula'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" placeholder="Nome da aula" value={nome} onChange={e => setNome(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicDescricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control type="text" placeholder="Descrição da aula" value={descricao} onChange={e => setDescricao(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicLink">
              <Form.Label>Link do Vídeo</Form.Label>
              <Form.Control type="url" placeholder="Link do vídeo" value={linkAula} onChange={e => setLinkAula(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={fecharModal}>Fechar</Button>
          <Button variant="primary" type="button" onClick={cadastraAula}>{id ? 'Salvar Alterações' : 'Cadastrar'}</Button>
        </Modal.Footer>
      </Modal>
      <div>
        <Form.Control
          type="text"
          placeholder="Buscar por nome"
          value={search}
          onChange={handleSearchChange}
          style={{ marginBottom: '20px' }}
        />
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="aulas">
            {(provided) => (
              <Table striped bordered hover {...provided.droppableProps} ref={provided.innerRef}>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('nome')}>
                      Nome
                      {sortColumn === 'nome' && (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
                    </th>
                    <th onClick={() => handleSort('descricao')}>
                      Descrição
                      {sortColumn === 'descricao' && (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
                    </th>
                    <th>Link do Vídeo</th>
                    <th>Opções</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAulas.map((aula, index) => (
                    <Draggable key={aula.id} draggableId={aula.id.toString()} index={index}>
                      {(provided) => (
                        <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <td>{aula.nome}</td>
                          <td>{aula.descricao}</td>
                          <td><a href={aula.link_aula} target="_blank" rel="noopener noreferrer">Assistir</a></td>
                          <td>
                            <Button variant="primary" onClick={() => editarAula(aula.id)}>Editar</Button>
                            <Button style={{ marginLeft: "10px" }} variant="danger" onClick={() => deletarAula(aula.id)}>Excluir</Button>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </Table>
            )}
          </Droppable>
        </DragDropContext>
        <Pagination>
          {Array.from({ length: Math.ceil(sortedAulas.length / itemsPerPage) }).map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  );
}

export default Aulas;
