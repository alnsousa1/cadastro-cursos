import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

function Cursos() {
  const navigate = useNavigate();
  const [id, setId] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);

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
    fetch("http://localhost:8000/api/v1/cursos/" + id, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          buscarCursos();
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
        navigate(`/cursos/${data.id}/modulos`);
      })
      .catch(error => alert(error.message));
  };

  const atualizarCurso = (curso) => {
    const formData = new FormData();
    formData.append('titulo', curso.titulo);
    formData.append('descricao', curso.descricao);
    if (curso.imagem) {
      formData.append('imagem', curso.imagem);
    }

    fetch("http://localhost:8000/api/v1/cursos/" + curso.id, {
      method: 'POST',
      body: formData,
      headers: {
        'X-HTTP-Method-Override': 'PUT'
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Não foi possível atualizar os dados do curso');
        }
      })
      .then(data => {
        buscarCursos();
        setId(null);
        setTitulo('');
        setDescricao('');
        setImagem(null);
      })
      .catch(error => alert(error.message));
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
    setImagem('');
    abrirModal();
  };

  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  return (
    <div>
      <Modal show={modalAberto} onHide={fecharModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de curso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicTitulo">
              <Form.Label>Titulo</Form.Label>
              <Form.Control type="text" placeholder="Titulo do curso:" value={titulo} onChange={e => setTitulo(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicDescricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Dê uma descrição ao curso:" value={descricao} onChange={e => setDescricao(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicImagem">
              <Form.Label>Capa do curso</Form.Label>
              <Form.Control type="file" onChange={e => setImagem(e.target.files[0])} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={fecharModal}>
            Fechar
          </Button>
          <Button variant="primary" type="button" onClick={submit}>
            Cadastrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Button variant="primary" type="button" onClick={reset}>
        Novo
      </Button>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Capa</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map(curso =>
              <tr key={curso.id} onClick={() => navigate(`/cursos/${curso.id}/modulos`)} style={{ cursor: 'pointer' }}>
                <td>{curso.titulo}</td>
                <td>{curso.descricao}</td>
                <td>
                  <img src={`http://localhost:8000/storage/${curso.imagem}`} alt="Capa" style={{ width: '120px', height: '90px' }} />
                </td>
                <td>
                  <Button variant="primary" onClick={(e) => {e.stopPropagation(); editarCurso(curso.id)}}>Editar</Button>
                  <Button variant="danger" onClick={(e) => {e.stopPropagation(); deletarCurso(curso.id)}}>Excluir</Button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Cursos;
