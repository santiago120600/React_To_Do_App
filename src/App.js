import React from 'react';
import './App.css';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      todoList:[],
      activeItem:{
        id:null,
        title:'',
        completed:false
      },
      editing:false
    }
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getCookie = this.getCookie.bind(this)
  };

  componentWillMount(){
    this.fetchTasks()
  }

  handleChange(e){
    var name = e.target.name
    var value = e.target.value
    //console.log("Name",name)
    //console.log("Value",value)

    this.setState({
      activeItem:{
        ...this.state.activeItem,
        title:value
      }
    })
  }

  getCookie(name) {
 	let cookieValue = null;
	 if (document.cookie && document.cookie !== '') {
		 const cookies = document.cookie.split(';');
		 for (let i = 0; i < cookies.length; i++) {
			 const cookie = cookies[i].trim();
		if (cookie.substring(0, name.length + 1) === (name + '=')) {
		 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		 break;
		 }
	 }
	 }
	 return cookieValue;
	 }


   startEdit(task){
    this.setState({
    activeItem:task,
    editing:true,    
    })         
   } 

  handleSubmit(e){
    e.preventDefault()
    console.log('Item',this.state.activeItem)

    var csrftoken = this.getCookie('csrftoken')

    var url = 'http://127.0.0.1:8000/api/task-create/'
    var _method = 'POST'  

    if(this.state.editing ==true){
        url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`
        this.setState({
          editing:false  
        })
        _method = 'PUT'

    }


    fetch(url,{
      method: _method,
      headers:{
	'Content-type':'application/json',
	'X-CSRFToken':csrftoken,
      },
      body:JSON.stringify(this.state.activeItem)
    }).then((response) => {
	this.fetchTasks()
      	this.setState({
	activeItem:{
	id:null,
	  title:'',
	  completed: false,
	}
	})
    }).catch(function(error){
	console.log('Error:',error)
    })
  }

  fetchTasks(){
    console.log("Fetching..")

    fetch('http://127.0.0.1:8000/api/task-list')
    .then(response => response.json())
    .then(data=>this.setState({
      todoList:data
    }))
  }


  render(){
    var tasks = this.state.todoList
    var self = this   
    return(
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form id="form" onSubmit={this.handleSubmit}>
              <div className="flex-wrapper">
                <div style={{flex:6}}>
                  <input onChange={this.handleChange} className="form-control" value={this.state.activeItem.title}  id="title" type="text" name="title" placeholder="Add task"/>
                </div>
                <div style={{flex:6}}>
                  <input className="btn btn-warning" id="submit" type="submit" name="Add"/>
                </div>
              </div>
            </form>
          </div>
          <div id="list-wrapper">
            {
              tasks.map(function(task, index){
                return(
                  <div key={index} className="task-wrapper flex-wrapper">

                    <div style={{flex:7}}>
                      <span>{task.title}</span>
                    </div>
                    <div style={{flex:1}}>
                      <button className="btn btn-sm btn-outline-info" onClick={()=>self.startEdit(task)} >Edit</button>
                    </div>
                    <div style={{flex:1}}>
                      <button className="btn btn-sm btn-outline-danger delete">-</button>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default App;
