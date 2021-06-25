import 'bootstrap/dist/css/bootstrap.min.css'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React from 'react';

import io from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:4001";


class ItemMessage extends React.Component {
    render() {
        return (
            <>
                <li className='py-2'>{this.props.text}</li>
            </>
        )
    }
}

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            allMessage: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.responseField = React.createRef();
        this.socket = io(ENDPOINT, {transports: ['websocket']});
    }

    componentDidMount() {
        this.socket.on('broadcast', (data) => {
            this.setState({allMessage: data, connected: true})
        });

        this.socket.on('disconnect', () => {
            this.setState({connected: false})
        });

        this.socket.on('connection', () => {
            this.setState({connected: true})
        });
    }

    handleSubmit(e) {
        let val = this.responseField.current.value;
        if (val) this.socket.emit('message', val);
        this.responseField.current.value = ''
    }

    render() {
        return (
            <div className='d-flex flex-column align-items-center'>
                <h1 className='mt-5'>My chat</h1>
                <ul className='col-6 p-4 list-unstyled bg-light text-dark rounded'>
                    {
                        this.state.allMessage.map(function (item) {
                            return <ItemMessage key={item} text={item}/>
                        })
                    }
                </ul>
                <Form className='col-6 d-flex justify-content-between' onClick={this.handleSubmit}>
                    <Form.Control className='mr-2' type="text"  ref={this.responseField}/>
                    <Button variant="primary">Send</Button>
                </Form>
            </div>
        );
    }
}


