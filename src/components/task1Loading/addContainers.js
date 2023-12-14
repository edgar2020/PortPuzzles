import React, { Component } from "react";
import '../../css/tasks.css'
class Container {
    
    constructor(name, weight) {
      this.name = name;
      this.weight = weight;
    }
  }

class AddContainers extends Component {

    state = {
        listitems: [
            // new Container(1, null),
            // new Container(2, null),
            // new Container(3, null),
            // new Container(4, null),
            // new Container(5, null),
            // new Container(6, null),
            // new Container(7, null),
            // new Container(8, null),
            // new Container(9, null),
            // new Container(10, null),
            // new Container(11, null),
            // new Container(12, null),
            // new Container(13, null),
            // new Container(14, null),
        ]
    };


    validateContainerName = () => {
        const r = /[a-zA-Z0-9!@#/\\$%^&*)(+=._-]/g;
        try {
            let containerName = document.getElementById('inputContainerName').value.trim();
            // console.log(containerName.match( r ));
            // alert(containerName);
            
            if(containerName === 'UNUSED' || containerName === 'NAN')
            {
                alert("\""+ containerName+"\" is not allowed");
            }
            else if(containerName.match(r) === null )
            {
                alert("\""+ containerName+"\" Does not contain recognizable printable english character");
            }
            else
            {
                this.state.listitems.push( new Container(containerName, null) );
                this.setState({ listitems : this.state.listitems });
                this.props.parentAddContainers(this.state.listitems);
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
        this.props.parentAddContainers(this.state.listitems);
    }
    
    render() {
        return (
            <div id="inputContainerNamesContainer" className="inputSection">
                <h3 id="containerToAddHeader">Add Containers to Load</h3>
                <div id="inputContainersUserInput">
                    {/* <label id="textBoxLabel">Container's Label:  */}
                        <input minLength={1} maxLength={255} id="inputContainerName" type="text" name="name" />
                    {/* </label> */}
                    <input type="submit" value="Submit" onClick={()=>{this.validateContainerName()}} />
                </div>
                <div id="userContainerShowContainers">
                    {/* <ul className="listContainers"> */}
                    <div id="containerCount">Loading {this.state.listitems.length} Containers</div>
                    {this.state.listitems.map((listitem, index) => 
                        <div key={index} className="individualContainers">
                            <div className="individualContainerName">{listitem.name}<button className="removeContainerButton" onClick={() => {this.removeContainerToAdd(index)}}>X</button></div>
                        </div>
                    )}
                </div>
            </div>
  )}
}

export default AddContainers; 
