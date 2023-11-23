import React, { Component } from "react";
import '../tasks.css'
class Container {
    
    constructor(name, weight) {
      this.name = name;
      this.weight = weight;
    }
  }

class AddContainers extends Component {

    state = {
        listitems: []
    };


    validateContainerName = () => {
        const r = /[a-zA-Z0-9!@#/\\\$%\^\&*\)\(+=._-]/g;
        try {
            let containerName = document.getElementById('inputContainerName').value.trim();
            // console.log(containerName.match( r ));
            // alert(containerName);
            
            if(containerName === 'UNUSED' || containerName === 'NAN')
            {
                alert("\'"+ containerName+"\' is not allowed");
            }
            else if(containerName.match(r) === null )
            {
                alert("\'"+ containerName+"\' Does not contain recognizable printable english character");
            }
            else
            {
                this.state.listitems.push( new Container(containerName, null) );
                this.setState({ listitems : this.state.listitems });
            }
            
            
        } catch (error) {
            alert( error);
        }
        document.getElementById('inputContainerName').value="";
    }
    
    removeContainerToAdd(id)  
    {
        // alert(id);
        this.state.listitems.splice(id, 1);
        this.setState({ listitems : this.state.listitems });
    }
    
    render() {
        return (
            <div id="inputContainerNamesContainer">
                <div id="inputContainersUserInput">
                    <label>Containers to Add: 
                        <input min={1} max={255} id="inputContainerName" type="text" name="name" />
                    </label>
                    <input type="submit" value="Submit" onClick={()=>{this.validateContainerName()}} />
                </div>
                <div id="userContainerShowContainers">
                    {/* <ul className="listContainers"> */}
                    {this.state.listitems.map((listitem, index) => 
                        <div key={index} className="individualContainers">
                        <p className="individualContainerName">{listitem.name}<button className="removeContainerButton" onClick={() => {this.removeContainerToAdd(index)}}>X</button></p>
                        </div>
                    )}
                    {/* </ul> */}
                </div>
            </div>
  )}
}

export default AddContainers; 
