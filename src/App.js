import 'bootstrap/dist/css/bootstrap.min.css'
import  Form  from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React from 'react';
import  io from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";

class ItemMessage extends React.Component{
    render() {
        return(
            <>
                <li>{this.props.text}</li>
            </>
        )
    }
}

export default class App extends React.Component {
    constructor() {
        super();
        this.state={
            response: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.responseField = React.createRef();
        this.socket = io(ENDPOINT, { transports : ['websocket'] });
    }
    componentDidMount() {
        this.socket.on('broadcast', (data) => {
            this.setState({ response: data, connected: true })
            console.log(this.state.response)
        });

        this.socket.on('disconnect', () => {
            this.setState({ connected: false })
        });

        this.socket.on('connection', () => {
            this.setState({ connected: true })
        });
    }

    handleSubmit(e) {
        let val = this.responseField.current.value;
        if (val) {
            this.socket.emit('message', val);
        }
        // this.setState({response: val});
    }

    render() {
        return (
            <div className='d-flex flex-column align-items-center'>
                <ul className='col-5 list-unstyled'>
                    {

                        this.state.response.map(function(item){
                            return <ItemMessage key={item} text={item} />
                        })
                    }
                </ul>
                <Form className='col-6 ' onClick={this.handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Messages</Form.Label>
                        <Form.Control type="text" placeholder="" ref={this.responseField}/>
                    </Form.Group>
                    <Button variant="primary" >
                        Submit
                    </Button>
                </Form>
            </div>

        );
    }


}


