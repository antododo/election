import React, { Component } from "react";
import ElectionContract from "./contracts/Election.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
  state = {
    hasVoted: false,
    candidates: [],
    web3: null,
    accounts: null,
    contract: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ElectionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ElectionContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getCandidates);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  getCandidates() {
    const { accounts, contract } = this.state;

    contract.methods
      .getCandidatesCount()
      .call()
      .then(candidatesCount => {
        console.log("candidate counts: " + candidatesCount);
        for (let i = 0; i < candidatesCount; i++) {
          contract.methods
            .getCandidate(i)
            .call()
            .then(candidate => {
              // Update state with the result.
              this.setState({
                candidates: this.state.candidates.concat([
                  {
                    id: candidate.id,
                    name: candidate.name,
                    voteCount: candidate.voteCount
                  }
                ])
              });
            });
        }
      })
      .catch(e => {
        console.log("error getting candidates");
        console.log(e);
      });
  }

  renderCandidate(_candidate) {
    return (
      <tr key={_candidate.id}>
        <th> {_candidate.id} </th>
        <td> {_candidate.name} </td>
        <td> {_candidate.voteCount} </td>
      </tr>
    );
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    let candidatesList = this.state.candidates.map(_candidate =>
      this.renderCandidate(_candidate)
    );

    return (
      <div className="App">
        <h1>Election Results</h1>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Votes</th>
            </tr>
          </thead>
          <tbody>{candidatesList}</tbody>
        </table>
      </div>
    );
  }
}

export default App;
