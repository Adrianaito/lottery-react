import "./App.css";
import React from "react";
import lottery from "./lottery";
import web3 from "./web3";

class App extends React.Component {
  state = {
    // properties from the lottery contract
    manager: "",
    players: [],
    balance: "",
    // components properties
    value: "",
    message: "",
  };
  async componentDidMount() {
    // pull of properties from the lottery contract and set the state
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    // retrieve a list of active accounts provided by metamask
    const accounts = await web3.eth.getAccounts();

    // set a waiting message
    this.setState({ message: "Waiting on transaction success..." });

    // call the function on the contract
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "You have been entered!" });
  };

  handleClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.pickWinner().send({ from: accounts[0] });

    this.setState({ message: "A winner has been picked!" });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is manage by {this.state.manager}.<br />
          There are currently {this.state.players.length} people entered,
          compeating to win {web3.utils.fromWei(this.state.balance, "ether")}{" "}
          ether!
        </p>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              type="text"
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>ready to pick a winner?</h4>
        <button onClick={this.handleClick}>Pick a winner!</button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
