import React, { Component } from "react";
import "./App.css";
import Preloader from './components/preloader';

class GithubApi extends Component {
		
		state = {
			data: {},
			loading: false,
			username: `crazydrummer81`,
			error: false,
			message: ''
		}

		getData(username) {
			const url = `https://api.github.com/users/${username}`
			this.setState({loading: true})
			
			fetch(url)
				.then(response => {
					console.log(response);
					if (response.status < 200 || response.status > 299) {
						if (response.status === 404) 
							return {
								error: true,
								message: 'No such user - ' + username
							}
						else throw Error(response.status);
					}
					return response.json()
				})
				.then(data => this.setState({
					data,
					loading: false,
					username,
					error: data.error,
					message: data.message
				}))
				.catch(status => {
					console.log(status);
					const message = 'Something goes wrong...';
					this.setState({error: true, loading: false, message});
				});
		}

		componentDidMount() {
			console.log('componentDidMount()');
			this.getData(this.props.username);
		}
		
		componentDidUpdate(prevProps, prevState) {
			console.log('componentDidUpdate()');
			if (this.props.username !== prevProps.username) {
				this.getData(this.props.username);
			}
		}

		render() {
			const {name, followers} = this.state.data;
			const {loading, error, message} = this.state;
			
			return(
				this.props.children({name, followers, loading, error, message})
			)
		}


}

export default class App extends Component {
	state = {
		username: 'crazydrummer81',
	}

	onInputUsername = () => {
		console.log('onInputUsername()');
		const username = this.input.value;
		this.setState({username: username});
		this.input.value = '';
	}

	onInputChange = (e) => {
		if (e.keyCode === 13) {
			this.onInputUsername();
		}
	}

	componentDidMount() {
		this.input = document.querySelector('input[name=username]');
	}

	render() {
		const {username} = this.state;
		console.log('username', username);
		return (
			<div className="App">
				<input name="username" onKeyDown={this.onInputChange}/>
				<button onClick={this.onInputUsername}>
					search
				</button>
				<GithubApi username={username}>
					{({ name, followers, loading, error, message }) => (
							<div className="info">
								{loading ? <Preloader/> : null}
								{error ? message : 
									`the user ${name || username} has ${followers} followers` }
							</div>
					)}
				</GithubApi>
			</div>
		);
	}
}
