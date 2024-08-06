import React from "react";
import {Table} from 'react-bootstrap';

class Aulas extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cursos: []
        }
    }

    render() {
        return (
            <Table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Capa</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Curso de Laravel</td>
                    </tr>
                </tbody>
            </Table>
        )
    }

}

export default Aulas;