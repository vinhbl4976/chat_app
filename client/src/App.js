import React from 'react';
import $ from 'jquery';
import Messages from './MessageList';
import Input from './Input';
import _map from 'lodash/map';
import io from 'socket.io-client';

import './App.css';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [
                {id: 1, userId: 0, userName: 'vi', message: 'Hello'}
            ],
            user: 1,
            socket: null,
        }
    }

    componentWillMount() {
        const socket = io('https://limitless-badlands-87304.herokuapp.com/');
        this.setState({socket})
        socket.on('id', res => this.setState({user: res}))
        socket.on('newMessage', (response) => {this.newMessage(response)});
    }

    newMessage(m) {
        const messages = this.state.messages;
        let ids = _map(messages, 'id');
        let max = Math.max(...ids);
        messages.push({
            id: max+1,
            userId: m.id,
            userName: 'vĩnh',
            message: m.data
        });

        let objMessage = $('.messages');
        if (objMessage[0].scrollHeight - objMessage[0].scrollTop === objMessage[0].clientHeight ) {
            this.setState({messages});
            objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);

        } else {
            this.setState({messages});
            if (m.id === this.state.user) {
                objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);
            }
        }
    }

    sendnewMessage(m) {
        if (m.value) {
            this.state.socket.emit("newMessage", m.value);
            m.value = "";
        }
    }

    componentDidUpdate() {
        if (this.state.typing) {
            if (true) {}
        }
    }

    typing(data) {
        if (data) {
            let objMessage = $('.messages');
            if (objMessage[0].scrollHeight - objMessage[0].scrollTop === objMessage[0].clientHeight) {
                this.setState({typing: data});
                objMessage.animate({ scrollTop: objMessage.prop('scrollHeight') }, 300);
            } else {
                this.setState({typing: data});
            }
        } else {
            this.setState({typing: false})
        }

    }
    render () {
        return (
           <div className="app__content">
              <h1>chat box</h1>
              <div className="chat_window">
                  <Messages user={this.state.user} messages={this.state.messages} typing={this.state.typing}/>
                  <Input sendMessage={this.sendnewMessage.bind(this)}/>
              </div>
            </div>
        )
    }
}