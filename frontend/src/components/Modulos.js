import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; // Adicione a importação dos ícones

function Modulos() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const [modulos, setModulos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [token, setToken] = useState(''); // Adicione lógica para obter o token, se necessário
  const [moduloEditando, setModuloEditando] = useState(null);
  const [search, setSearch] = useState(''); // Estado para busca
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState('titulo'); // Estado para coluna de ordenação
  const [sortOrder, setSortOrder] = useState('asc'); // Estado para ordem de ordenação

  useEffect(() => {
    if (cursoId) {
      buscarModulos();
    }
  }, [cursoId]);

  const buscarModulos = () => {
    fetch(`http://localhost:8000/api/v1/cursos/${cursoId}/modulos`, {
      headers: {
        'Authorization': `Bearer ${token}` // Inclua o token, se necessário
      }
    })
      .then(response => response.json())
      .then(response => {
        setModulos(response.data);
      });
  };

  const handleModuloClick = (moduloId) => {
    navigate(`/modulos/${cursoId}/${moduloId}/aulas`); // Redireciona para a listagem de aulas
  };

  const cadastraModulo = () => {
    if (!titulo) {
      Swal.fire('Erro', 'Por favor, insira o título do módulo.', 'error');
      return;
    }

    const url = moduloEditando
      ? `http://localhost:8000/api/v1/modulos/${moduloEditando.id}`
      : `http://localhost:8000/api/v1/cursos/${cursoId}/modulos`;

    const method = moduloEditando ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ titulo })
    })
      .then(response => {
        if (response.ok) {
          Swal.fire('Sucesso', `Módulo ${moduloEditando ? 'atualizado' : 'cadastrado'} com sucesso!`, 'success');
          return response.json();
        } else {
          throw new Error('Não foi possível salvar o módulo');
        }
      })
      .then(data => {
        buscarModulos();
        fecharModal();
        setModuloEditando(null);
      })
      .catch(error => Swal.fire('Erro', error.message, 'error'));
  };

  const editarModulo = (modulo) => {
    setModuloEditando(modulo);
    setTitulo(modulo.titulo);
    setModalAberto(true);
  };

  const excluirModulo = (moduloId) => {
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
        fetch(`http://localhost:8000/api/v1/modulos/${moduloId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            if (response.ok) {
              Swal.fire('Excluído!', 'O módulo foi excluído.', 'success');
              buscarModulos();
            } else {
              throw new Error('Não foi possível excluir o módulo');
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
    setTitulo('');
  };

  const filteredModulos = modulos.filter(modulo =>
    modulo.titulo.toLowerCase().includes(search.toLowerCase())
  );

  const sortedModulos = filteredModulos.sort((a, b) => {
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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Resetar para a primeira página quando a busca mudar
  };

  const indexOfLastModulo = currentPage * itemsPerPage;
  const indexOfFirstModulo = indexOfLastModulo - itemsPerPage;
  const currentModulos = sortedModulos.slice(indexOfFirstModulo, indexOfLastModulo);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="m-3">
      <Button variant="primary" type="button" onClick={abrirModal} style={{ marginBottom: '20px' }}>
        Novo
      </Button>
      <Modal show={modalAberto} onHide={fecharModal}>
        <Modal.Header closeButton>
          <Modal.Title>{moduloEditando ? 'Editar Módulo' : 'Cadastro de Módulo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicTitulo">
              <Form.Label>Título</Form.Label>
              <Form.Control type="text" placeholder="Título do módulo:" value={titulo} onChange={e => setTitulo(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={fecharModal}>Fechar</Button>
          <Button variant="primary" type="button" onClick={cadastraModulo}>{moduloEditando ? 'Salvar Alterações' : 'Cadastrar'}</Button>
        </Modal.Footer>
      </Modal>
      <Form.Control
        type="text"
        placeholder="Buscar por título"
        value={search}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px' }}
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort('titulo')}>
              Título
              {sortColumn === 'titulo' && (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
            </th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {currentModulos.map(modulo => (
            <tr key={modulo.id} style={{ cursor: 'pointer' }}>
              <td onClick={() => handleModuloClick(modulo.id)}>{modulo.titulo}</td>
              <td>
                <Button style={{ marginRight: "10px" }} variant="primary" onClick={() => editarModulo(modulo)}>Editar</Button>
                <Button variant="danger" onClick={() => excluirModulo(modulo.id)}>Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {Array.from({ length: Math.ceil(sortedModulos.length / itemsPerPage) }).map((_, index) => (
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
  );
}

export default Modulos;
