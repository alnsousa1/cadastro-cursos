import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";

function Aulas() {
  const { moduloId, cursoId } = useParams(); // Pegue moduloId e cursoId dos parâmetros da URL
  const navigate = useNavigate();
  const [aulas, setAulas] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [linkAula, setLinkAula] = useState('');
  const [id, setId] = useState(null); // Adiciona um estado para armazenar o ID da aula a ser editada
  const [token, setToken] = useState(''); // Adicione lógica para obter o token, se necessário

  useEffect(() => {
    if (moduloId) {
      buscarAulas();
    }
  }, [moduloId]);

  const buscarAulas = () => {
    console.log(`Fetching aulas for moduloId: ${moduloId}`); // Adicione log para verificar o moduloId
    fetch(`http://localhost:8000/api/v1/cursos/${cursoId}/modulos/${moduloId}/aulas`, {
      headers: {
        'Authorization': `Bearer ${token}` // Inclua o token, se necessário
      }
    })
      .then(response => response.json())
      .then(response => {
        setAulas(response.data);
      });
  };
  console.log(`moduloId recebido: ${moduloId}, cursoId recebido: ${cursoId}`);

  const cadastraAula = () => {
    if (!nome || !descricao || !linkAula) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    const metodo = id ? 'PUT' : 'POST';
    const url = id 
      ? `http://localhost:8000/api/v1/aulas/${id}`  // Rota corrigida para edição
      : `http://localhost:8000/api/v1/modulos/${moduloId}/aulas`;  // Rota para cadastro

    fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Certifique-se de que o token está correto
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
          // Atualiza a lista de aulas localmente após edição
          setAulas(aulas.map(aula => aula.id === id ? data : aula));
        } else {
          // Adiciona a nova aula à lista existente
          setAulas([...aulas, data]);
        }
        fecharModal(); // Fecha o modal após o cadastro ou edição
      })
      .catch(error => alert(error.message));
  };

  const editarAula = (id) => {
    fetch(`http://localhost:8000/api/v1/aulas/${id}`, {  // Rota corrigida para edição
      headers: {
        'Authorization': `Bearer ${token}` // Inclua o token, se necessário
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
    fetch(`http://localhost:8000/api/v1/aulas/${id}`, {  // Rota corrigida para exclusão
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` // Inclua o token, se necessário
      }
    })
      .then(response => {
        if (response.ok) {
          setAulas(aulas.filter(aula => aula.id !== id));
        } else {
          throw new Error('Não foi possível excluir a aula');
        }
      })
      .catch(error => alert(error.message));
  };

  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setNome('');
    setDescricao('');
    setLinkAula('');
    setId(null); // Reseta o ID da aula ao fechar o modal
  };

  return (
    <div>
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
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Link do Vídeo</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {aulas.map(aula => (
            <tr key={aula.id}>
              <td>{aula.nome}</td>
              <td>{aula.descricao}</td>
              <td><a href={aula.link_aula} target="_blank" rel="noopener noreferrer">Assistir</a></td>
              <td>
                <Button variant="primary" onClick={() => editarAula(aula.id)}>Editar</Button>
                <Button variant="danger" onClick={() => deletarAula(aula.id)}>Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Aulas;
