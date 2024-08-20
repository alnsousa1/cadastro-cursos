import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";

function Modulos() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const [modulos, setModulos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [token, setToken] = useState(''); // Adicione lógica para obter o token, se necessário
  const [moduloEditando, setModuloEditando] = useState(null);

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
      alert('Por favor, insira o título do módulo.');
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
          return response.json();
        } else {
          throw new Error('Não foi possível salvar o módulo');
        }
      })
      .then(data => {
        buscarModulos(); // Atualiza a lista de módulos
        fecharModal();
        setModuloEditando(null); // Limpa o estado de edição
      })
      .catch(error => alert(error.message));
  };


  const editarModulo = (modulo) => {
    setModuloEditando(modulo);
    setTitulo(modulo.titulo);
    setModalAberto(true);
  };

  const excluirModulo = (moduloId) => {
    if (window.confirm('Tem certeza que deseja excluir este módulo?')) {
      fetch(`http://localhost:8000/api/v1/modulos/${moduloId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (response.ok) {
            buscarModulos(); // Atualiza a lista de módulos após a exclusão
          } else {
            throw new Error('Não foi possível excluir o módulo');
          }
        })
        .catch(error => alert(error.message));
    }
  };


  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setTitulo('');
  };

  return (
    <div>
      <Button variant="primary" type="button" onClick={abrirModal} style={{ marginBottom: '20px' }}>
        Novo
      </Button>
      <Modal show={modalAberto} onHide={fecharModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de Módulo</Modal.Title>
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
          <Button variant="primary" type="button" onClick={cadastraModulo}>Cadastrar</Button>
        </Modal.Footer>
      </Modal>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Título</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {modulos.map(modulo => (
            <tr key={modulo.id} style={{ cursor: 'pointer' }}>
              <td onClick={() => handleModuloClick(modulo.id)}>{modulo.titulo}</td>
              <td>
                <Button variant="primary" onClick={() => editarModulo(modulo)}>Editar</Button>
                <Button variant="danger" onClick={() => excluirModulo(modulo.id)}>Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>

      </Table>
    </div>
  );
}

export default Modulos;
