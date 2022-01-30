import React, {useEffect, useState} from 'react';
import {Filters} from './components/Filters';
import {v4 as uuidv4} from 'uuid';
import {TodoItem} from './components/TodoItem';
import {initialTodos} from './mocked';
import axios from "axios";
import './App.css';

const App = () => {

    const [todos, setTodos] = useState(initialTodos);
    const [filteredTodos, setFilteredTodos] = useState(initialTodos);
    const [descriptionQuery, setDescriptionQuery] = useState('');
    const [userName, setUserName] = useState('');
    const [categoryQuery, setCategoryQuery] = useState('Office');
    const [currentCategory, setCurrentCategory] = useState('Office');

    async function fetchData() {
        let apiTodos = await axios.get('https://flask-qa-deploy-postgres.herokuapp.com/api/getNotes/' + userName);
        console.log(apiTodos);
        // let test = JSON.parse('[{ "id": "ea47ca06-afcb-46ac-953b-d7211a5db98a", "description": "Laundary", "category": "Home", "isDone": false },{ "id": "520a8762-0d0c-4c07-a5a0-c05701d740a1", "description": "Make a presentation", "category": "Office", "isDone": true }, { "id": "520a8762-0d0c-4c07-a5a0-c05701d740a2", "description": "Do the release", "category": "Office", "isDone": false } ]')
        let test = JSON.parse(apiTodos.data);
        console.log(test);
        if(test !== 'not okay'){
            setTodos(test);
        }
        
      }

      

    useEffect(() => {
        
        
       
        // filterTodos(test, 'Office')
        // JSONParser parser = new JSONParser();
        // JSONArray json = (JSONArray) parser.parse(stringToParse);
        setFilteredTodos(filterTodos(todos, currentCategory));
    }, [currentCategory, todos]);
    // }, []);

    const addTodo = () => {
        if (descriptionQuery.length > 0 && categoryQuery.length > 0) {
            setDescriptionQuery('');
            setTodos([...todos, {id: uuidv4(), description: descriptionQuery, category: categoryQuery, isDone: false}]);
            filterTodos(todos, currentCategory)
            var bodyFormData = new FormData();
            bodyFormData.append('username', userName);
            bodyFormData.append('notes', JSON.stringify([...todos, {id: uuidv4(), description: descriptionQuery, category: categoryQuery, isDone: false}]));
            axios.post('https://flask-qa-deploy-postgres.herokuapp.com/api/postNotes',  bodyFormData).then(respnse => Response.JSON);
        }
    };

    const addUser = () => {
        fetchData();
        if (userName.length > 0) {
            setTodos([...todos, {id: uuidv4(), description: descriptionQuery, category: categoryQuery, isDone: false}]);
            setUserName(userName);
        }
    };

    const toggleIsCompleted = (id) => {
        const tempTodos = [...todos];
        const currentTodo = tempTodos.find(todo => todo.id === id);
        currentTodo.isDone = !currentTodo.isDone;
        var bodyFormData = new FormData();
        bodyFormData.append('username', userName);
        bodyFormData.append('notes', JSON.stringify(tempTodos));
        axios.post('https://flask-qa-deploy-postgres.herokuapp.com/api/postNotes',  bodyFormData).then(respnse => Response.JSON);
        setTodos(tempTodos);
    };


    const changeFilter = (selectedCategory) => {
        setCurrentCategory(selectedCategory);
    };

    const filterTodos = (allTodoItems, currentCategory) => {
        return allTodoItems.filter(todo => todo.category === currentCategory);
    };

    const TodoListJSX = filteredTodos.map(todo =>
        <TodoItem
            key={todo.id}
            todo={todo}
            toggleIsCompleted={toggleIsCompleted}
        />);

    return (
        <div className='App'>
            <section className='column'>
                <h1>Todo</h1>
                <div className='add-user'>
                <input value={userName} onChange={e => setUserName(e.target.value)} placeholder='User Name'/>
                    {/* <input value={categoryQuery} onChange={e => setCategoryQuery(e.target.value)}/> */}
                    <span role="img" aria-label="+" className='plus' onClick={() => addUser()}> <button>Search User</button></span>
                </div>
                
                <ul>{TodoListJSX}</ul>
                <div className='add-item'>
                    <input value={descriptionQuery} onChange={e => setDescriptionQuery(e.target.value)} placeholder='add a task...'/>
                    <input value={categoryQuery} onChange={e => setCategoryQuery(e.target.value)}/>
                    <span role="img" aria-label="+" className='plus' onClick={() => addTodo()}> ➕</span>
                </div>
            </section>
            <section className='column'>
                <Filters
                    todos={todos}
                    changeFilter={changeFilter}
                    currentCategory={currentCategory}
                />
            </section>
        </div>
    );
};

export default App;