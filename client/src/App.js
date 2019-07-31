import React, { Component } from "react";
import ElectionContract from "./contracts/Election.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      hasVoted: false,
      candidates: [],
      selectedCandidate: 0,
      web3: null,
      accounts: null,
      contract: null
    };
    this.onSubmit = this.onSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this);
  }


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
    this.state.contract.methods
      .getCandidatesCount()
      .call()
      .then(candidatesCount => {
        console.log("candidate counts: " + candidatesCount);
        for (let i = 0; i < candidatesCount; i++) {
          this.state.contract.methods
            .getCandidate(i)
            .call()
            .then(candidate => {
              // Update state with the result.
              this.setState({
                candidates: this.state.candidates.concat([
                  {
                    id: i,
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

  onSubmit(e){
    e.preventDefault()
    console.log("Voting for:" + this.state.selectedCandidate)
    this.state.contract.methods
      .vote(this.state.selectedCandidate)
      .send({ from: this.state.accounts[0] })
      .on("receipt", function(receipt) {
        console.log("receipt");
        // TODO update UI after vote
        console.log("UI update")
        this.getCandidates(); //TODO not updating?
        this.setState({ hasVoted: true }) //TODO not updating?
      })
      .on("error", console.error);
  }

  handleChange(event){
    this.setState({ selectedCandidate: event.target.value });
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

  // renderCandidateDropdown(_candidate) {
  //   return <option value={_candidate.id}>{_candidate.name}</option>
  // }

  render() {
             if (!this.state.web3) {
               return (
                 <div>Loading Web3, accounts, and contract...</div>
               );
             }

             let candidatesList = this.state.candidates.map(
               _candidate => this.renderCandidate(_candidate)
             );

             // TODO candidatesDropdown should be render dynamically
             let candidatesDropdown = [
               <option key={"v1"} value={0}>Canditate 1</option>,
               <option key={"v2"} value={1}>Canditate 2</option>
             ];
             // let candidatesDropdown = this.state.candidates.map(_candidate => {
             //   this.renderCandidateDropdown(_candidate);
             // });

             console.log(candidatesDropdown);

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
                 <div>
                   <h2>Select candidate:</h2>
                   <form>
                     <select
                       value={this.state.selectedCandidate}
                       onChange={this.handleChange}
                     >
                       {candidatesDropdown}
                     </select>
                     <button disabled={this.state.hasVoted} onClick={this.onSubmit}>Vote</button>
                   </form>
                 </div>
               </div>
             );
           }
}

export default App;
