import React , {useState, useEffect} from 'react';
import './App.css';
import {
  Table  ,
  Container ,
   Row , 
   Col ,
    Button , 
    ButtonGroup , 
    Form ,
     Navbar,
     NavbarBrand,
     AccordionCollapse,
     FormGroup,
} from "react-bootstrap";

import axios from  "axios";
import {toast , ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

const api = "http://localhost:5000" ;

const initialState = {
  postId: " ",
  body: " ",
  username: " ",
};

function App() {
  const [state, setState] = useState(initialState);
  const [data,setData] =useState([]);
  const { body , username ,postId} =state;
  const [userId , setUserId] = useState (null);
  const[editMode, setEditMode] = useState(false);
  const [value , setValue] = useState ("");

  useEffect(()=>{
    loadusers();
  }, [])
  const loadusers = async () => {
    const response = await axios.get(api);
    setData(response.data);
  };
  const handleUpdate = (id) => {
    const singleUser = data.find((item)=> item.id === id);
    setState({...singleUser});
    setUserId(id);
    setEditMode (true);  
    };
  const handleChange = (e) => {
    let {name , value} =e.target;
    setState ({...state,[name]: value});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username  || !body || !postId  )  {
      toast.error("Plese fill all input");
      
    }

    else{
      if(!editMode) {
        axios.post(api ,state);
        toast.success("Added Successfully");
     setState({username:" " , body:  " " , postId:" "});
     setTimeout(()=> loadusers() ,500);

      }
      else{
        axios.put(`${api}/${userId}`,state);
        toast.success("Updated Successfully");
     setState({username:"" , body:  " " , postId:""});
     setTimeout(()=> loadusers() ,500);
     setUserId(null);
     setEditMode(false);
      }
          
      
    }
    
  };
  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete the comment?")){
      axios.delete(`${api}/${id}`);
      toast.success("Deleted");
      setTimeout(()=> loadusers(),500);
    }
  
  };

 
 const handleReset = () => {

   loadusers();
 }
 const handleSearch = async (e) => {
  e.preventDefault();
  return await axios.get (`http://localhost:5000?q=${value}`).then((response)=> {
    setData(response.data);
     setValue("");
 })
  .catch((err)=> console.log(err));
 };
  

   
   
   
  return (
    <>

   
    <ToastContainer/>
    <Navbar bg = "primary" variant='dark' className='justify-content-center'>
      <NavbarBrand>
        Webable Assesment
      </NavbarBrand>
      <Form className="d-flex"  onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value = {value}
              onChange = {(e) => setValue(e.target.value)}
            />
            <ButtonGroup>
            <Button variant="info"  type= "submit"><strong>
            Search</strong></Button>
            <Button variant="danger" onClick = {() => handleReset ()}> <strong>
            Reset  </strong></Button>
            </ButtonGroup>
         
          </Form>

    </Navbar>
    <Container style ={{marginTop : "70px"}}>
      <Row>
        <Col  md= {4} >
        <h2 className='text-dark'>Form</h2>
          <Form  onSubmit = {handleSubmit}>
          <FormGroup>
            <Form.Label className='text-secondary' style ={{textALign: "left"}}> <strong> PostID</strong></Form.Label>
            <Form.Control type="number" placeholder= "" name= "postId" value= {postId}  onChange= {handleChange} required></Form.Control>
            
            </FormGroup>
            <Form.Group>
            <Form.Label className='text-secondary' style ={{textALign: "left"}}> <strong> UserName</strong></Form.Label>
            <Form.Control type="text" placeholder= "UserName" name= "username" value= {username} onChange= {handleChange} required></Form.Control>
          
            </Form.Group>

            <FormGroup>
            <Form.Label className='text-secondary' style ={{textALign: "left"}}> <strong> Comment</strong></Form.Label>
            <Form.Control type="text" placeholder ="Comments" name= "body" value= {body} onChange= {handleChange} required></Form.Control>
             </FormGroup>
           
           
            <div className='d-grid gap-2 mt-2'>
              <Button  type="submit" variant = "success" size= "lg">
                Submit
              </Button>
            </div>
           
          </Form>
         
          </Col>
           
           <Col md={8}>
            <h2 className='text-center text-danger'>
              Comments
            </h2>
          <Table bordered hover>
             <thead>
              <tr>
                <th> NO.</th>
                <th >PostID</th>
                <th> Body</th>
                <th> UserName </th>
                <th> Actions</th>
                
              </tr>
              </thead>
           
            {data && data.map ((item,id)=>(
             <tbody key = {item.id}>
              <tr>
                <td>{id+1} </td>
                <td>{item.postId} </td>
                <td>{item.body} </td>
                <td> {item.user.username}</td>
                
                
                <td>
                  <ButtonGroup>
                    <Button style={{marginRight: "5px"}} variant= "info"
                    onClick={()=> handleUpdate(item.id)}
                    >
                      Update

                    </Button>
                    <Button style={{marginRight: "5px"}} variant= "danger"
                    onClick={()=> handleDelete(item.id)}
                    
                    >
                     Delete

                    </Button>

                  </ButtonGroup>
                </td>
                
                
              </tr>
             </tbody> 
            ))}
          </Table>
        </Col>
      </Row>
    </Container>
    </>


      

  
   
  );
}

export default App;
