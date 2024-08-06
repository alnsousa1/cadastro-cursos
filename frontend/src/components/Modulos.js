import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";

function Modulos() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const [modulos, setModulos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [titulo, setTitulo] = useState('');

  useEffect(() => {
    buscarModulos();
  }, []);

  const buscarModulos = () => {
    fetch(`http://localhost:8000/api/v1/cursos/${cursoId}/modulos`)
      .then(response => response.json())
      .then(response => {
        setModulos(response.data);
      });
  };

  const cadastraModulo = (modulo) => {
    fetch(`http://localhost:8000/api/v1/cursos/${cursoId}/modulos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modulo)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Não foi possível adicionar o módulo');
        }
      })
      .then(data => {
        navigate(`/aulas/${data.id}`); // Redireciona para a página de aulas com o ID do módulo
      })
      .catch(error => alert(error.message));
  };

  return (
    <div>
      <Modal show={modalAberto} onHide={() => setModalAberto(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de módulo</Modal.Title>
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
          <Button variant="secondary" onClick={() => setModalAberto(false)}>Fechar</Button>
          <Button variant="primary" type="button" onClick={() => cadastraModulo({ titulo })}>Cadastrar</Button>
        </Modal.Footer>
      </Modal>
      <Button variant="primary" type="button" onClick={() => setModalAberto(true)}>Novo</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Título</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {modulos.map(modulo => (
            <tr key={modulo.id}>
              <td>{modulo.titulo}</td>
              <td>
                <Button variant="primary">Editar</Button>
                <Button variant="danger">Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Modulos;
