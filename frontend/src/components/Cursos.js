import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Importa o Swal Alerts
import { FaArrowUp, FaArrowDown } from 'react-icons/fa'; // Adicione a importação dos ícones

function Cursos() {
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [search, setSearch] = useState(''); // Estado para busca
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState('titulo'); // Estado para coluna de ordenação
  const [sortOrder, setSortOrder] = useState('asc'); // Estado para ordem de ordenação

  useEffect(() => {
    buscarCursos();
  }, []);

  const buscarCursos = () => {
    fetch("http://localhost:8000/api/v1/cursos")
      .then(response => response.json())
      .then(response => {
        setCursos(response.data);
      });
  };

  const deletarCurso = (id) => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Não, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost:8000/api/v1/cursos/" + id, { method: 'DELETE' })
          .then(response => {
            if (response.ok) {
              Swal.fire('Excluído!', 'O curso foi excluído.', 'success');
              buscarCursos();
            } else {
              Swal.fire('Erro!', 'Não foi possível excluir o curso.', 'error');
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'Seu curso está seguro :)', 'error');
      }
    });
  };

  const editarCurso = (id) => {
    fetch("http://localhost:8000/api/v1/cursos/" + id)
      .then(response => response.json())
      .then(response => {
        setId(response.data.id);
        setTitulo(response.data.titulo);
        setDescricao(response.data.descricao);
        setImagem(null);
        abrirModal();
      });
  };

  const cadastraCurso = (curso) => {
    const formData = new FormData();
    formData.append('titulo', curso.titulo);
    formData.append('descricao', curso.descricao);
    formData.append('imagem', curso.imagem);

    fetch("http://localhost:8000/api/v1/cursos", {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Não foi possível adicionar o curso');
        }
      })
      .then(data => {
        Swal.fire('Sucesso!', 'O curso foi cadastrado com sucesso.', 'success');
        navigate(`/cursos/${data.id}/modulos`);
      })
      .catch(error => {
        Swal.fire('Erro!', 'Não foi possível adicionar o curso.', 'error');
      });
  };

  const atualizarCurso = (curso) => {
    const formData = new FormData();
    formData.append('titulo', curso.titulo);
    formData.append('descricao', curso.descricao);

    // Somente adicionar a imagem se ela for alterada
    if (curso.imagem) {
      formData.append('imagem', curso.imagem);
    }

    fetch(`http://localhost:8000/api/v1/cursos/${curso.id}`, {
      method: 'POST', // Se o backend espera PUT, continue usando PUT.
      body: formData,
      headers: {
        'X-HTTP-Method-Override': 'PUT' // Isso é importante se o backend espera um PUT, mas você está usando POST
      }
    })
      .then(response => {
        if (response.ok) {
          Swal.fire('Sucesso!', 'O curso foi atualizado com sucesso.', 'success');
          buscarCursos();
          setId(null);
          setTitulo('');
          setDescricao('');
          setImagem(null);
        } else {
          throw new Error('Não foi possível atualizar os dados do curso');
        }
      })
      .catch(error => {
        Swal.fire('Erro!', 'Não foi possível atualizar os dados do curso.', 'error');
      });
  };

  const submit = () => {
    const curso = {
      id: id,
      titulo: titulo,
      descricao: descricao,
      imagem: imagem
    };

    if (id === null) {
      cadastraCurso(curso);
    } else {
      atualizarCurso(curso);
    }

    fecharModal();
  };

  const reset = () => {
    setId(null);
    setTitulo('');
    setDescricao('');
    setImagem(null);
    abrirModal();
  };

  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const filteredCursos = cursos.filter(curso =>
    curso.titulo.toLowerCase().includes(search.toLowerCase())
  );

  const sortedCursos = filteredCursos.sort((a, b) => {
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

  const indexOfLastCurso = currentPage * itemsPerPage;
  const indexOfFirstCurso = indexOfLastCurso - itemsPerPage;
  const currentCursos = sortedCursos.slice(indexOfFirstCurso, indexOfLastCurso);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="m-3">
        <Button style={{ marginBottom: "10px" }} variant="primary" type="button" onClick={reset}>
          Novo
        </Button>
        <Modal show={modalAberto} onHide={fecharModal}>
          <Modal.Header closeButton>
            <Modal.Title>{id ? 'Editar Curso' : 'Cadastro de Curso'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicTitulo">
                <Form.Label>Título</Form.Label>
                <Form.Control type="text" placeholder="Título do curso:" required value={titulo} onChange={e => setTitulo(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicDescricao">
                <Form.Label>Descrição</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Dê uma descrição ao curso:" required value={descricao} onChange={e => setDescricao(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicImagem">
                <Form.Label>Capa do Curso</Form.Label>
                <Form.Control type="file" onChange={e => setImagem(e.target.files[0])} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={fecharModal}>
              Fechar
            </Button>
            <Button variant="primary" type="button" onClick={submit}>
              {id ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
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
              <th onClick={() => handleSort('descricao')}>
                Descrição
                {sortColumn === 'descricao' && (sortOrder === 'asc' ? <FaArrowUp /> : <FaArrowDown />)}
              </th>
              <th>Capa</th>
              <th>Módulos</th>
              <th>Aulas</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {currentCursos.map(curso =>
              <tr key={curso.id} onClick={() => navigate(`/cursos/${curso.id}/modulos`)} style={{ cursor: 'pointer' }}>
                <td>{curso.titulo}</td>
                <td>{curso.descricao}</td>
                <td>
                  <img src={`http://localhost:8000/storage/${curso.imagem}`} alt="Capa" style={{ width: '120px', height: '90px' }} />
                </td>
                <td>{curso.modulos_count}</td>
                <td>{curso.aulas_count}</td>
                <td>
                  <Button variant="primary" onClick={(e) => { e.stopPropagation(); editarCurso(curso.id) }}>Editar</Button>
                  <Button style={{ marginLeft: "10px" }} variant="danger" onClick={(e) => { e.stopPropagation(); deletarCurso(curso.id) }}>Excluir</Button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <Pagination>
          {Array.from({ length: Math.ceil(sortedCursos.length / itemsPerPage) }).map((_, index) => (
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

export default Cursos;
