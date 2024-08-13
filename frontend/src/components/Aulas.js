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
  const [token, setToken] = useState(''); // Adicione lógica para obter o token, se necessário

  useEffect(() => {
    if (moduloId) {
      buscarAulas();
    }
  }, [moduloId]);

  const buscarAulas = () => {
    console.log(`Fetching aulas for moduloId: ${moduloId}`); // Adicione log para verificar o moduloId
    fetch(`http://localhost:8000/api/v1/modulos/${moduloId}/aulas`, {
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
    fetch(`http://localhost:8000/api/v1/modulos/${moduloId}/aulas`, {
      method: 'POST',
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
          throw new Error('Não foi possível adicionar a aula');
        }
      })
      .then(data => {
        // Atualize a lista de aulas localmente
        setAulas([...aulas, data]); // Adicione a nova aula à lista existente
        fecharModal(); // Fecha o modal após o cadastro
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
  };

  return (
    <div>
      <Button variant="primary" type="button" onClick={abrirModal} style={{ marginBottom: '20px' }}>
        Novo
      </Button>
      <Modal show={modalAberto} onHide={fecharModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de Aula</Modal.Title>
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
          <Button variant="primary" type="button" onClick={cadastraAula}>Cadastrar</Button>
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
              <td><a href={aula.aula} target="_blank" rel="noopener noreferrer">Assistir</a></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Aulas;
