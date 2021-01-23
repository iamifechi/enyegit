import React from 'react';
import './App.css';
import Pages from './Pages';
import styled,{css} from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp,faSearch,faCaretDown,faBars,faTimes} from '@fortawesome/free-solid-svg-icons';
//import response from './records'

window.onscroll = () =>{
  scrollFunction();
};

const scrollFunction=()=>{
  let scrollPosition = window.scrollY;
  let backToTopBtn = document.getElementById("backToTop");
  let navBtn = document.getElementById("nav-button");

  if(scrollPosition > 500){
    navBtn.style.display = "none";
    backToTopBtn.style.display ="block"
  }
  else{
    navBtn.style.display = "block"
    backToTopBtn.style.display = "none";
  }
}

const backToTopFunc = () =>{
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

const BackToTop = styled.button`
  position:fixed;
  bottom:15vh;
  display:none;
  right:2%;
  padding:10px 15px;
  width:50px;
  height:50px;
  text-align:center;
  border:none;
  border-radius:50%;
  background:white;
  color:black;
  font-size:1em;
  filter:drop-shadow(0px 0px 10px rgba(80, 80, 80, 0.26));
  

  :hover{
    cursor:pointer;
  }

  :hover,:focus{
    color:whitesmoke;
    background:#581845;
    transform:scale(1.1);
  }
  :focus{
    outline:none
  }
`;

const NavButton = styled.button`
  position:fixed;
  top:6vh;
  right:15px;
  padding:10px;
  width:50px;
  height:50px;
  text-align:center;
  border:none;
  border-radius:50%;
  background:white;
  color:black;
  font-size:1em;
  z-index:99;
  filter:drop-shadow(0px 0px 5px rgba(80, 80, 80, 0.26));

  ${props=>props.toggle && css`
    color:white;
    background:#581845;

    :hover,:focus{
      color:black;
      background:white;
    }

  `}


  :hover{
    cursor:pointer;
  }

  :hover{
    color:whitesmoke;
    background:#581845;
    transform:scale(1.1);
  }
  :focus{
    outline:none
  }
`;

const sorting = (profiles) => {
  let sortOptions = [];
  let gender = profiles.map(v=>v.Gender);
  let payment = profiles.map(v=>v.PaymentMethod);
  let card = profiles.map(v=>v.CreditCardType);

  let genderOption = gender.filter((v,i)=> i === gender.indexOf(v))
  let paymentOption = payment.filter((v,i)=>i === payment.indexOf(v));
  let cardOption = card.filter((v,i)=>i === card.indexOf(v));


  sortOptions = [
    {name:"Gender",options:[...genderOption]},
    {name:"Payment Method",options:[...paymentOption]},
    {name:"Card Type",options:[...cardOption]}
  ];
  return sortOptions
}

const CreateSortOptions = (props) =>{
  let sortOptions = sorting(props.profiles);
 
  return sortOptions.map((method,index)=>{
    return(
        <div key={method.name} className="dropdown">
            <button>
             {method.name} <FontAwesomeIcon size="lg" icon={faCaretDown}/>
              <div className="options">
                {method.options.map(option=><input key={option} 
                value={option} type="text" 
                readOnly
                onClick={()=>props.handleSort(option)}/>)}
              </div>
            </button>
          </div>
    )
  })

}

class App extends React.Component {
  constructor(props){
    super(props);

    this.state={
      profiles:null,
      pages:null,
      fetchSuccess:false,
      searchInput:'',
      toggle:false,
      sort:null,
      action:null,
    }

  }

  handleSearch =(e)=>{
    
    this.setState(()=>{
      return {
        searchInput:e.target.value,
        action: "search"
      }
    },
    ()=>{
      if(this.state.searchInput===""){
        this.setState({action:null})
      }
      else{  
        let input = this.state.searchInput.toLowerCase();
        let searchResults = [...this.state.profiles]
      .filter(user=>{
        let firstName = user.FirstName.toLowerCase();
        let lastName = user.LastName.toLowerCase();     
        return firstName.includes(input)||
        lastName.includes(input) ? true : false;
    });
      this.renderPage(searchResults);
      }

    })
  }

  renderPage = (array) =>{
      let arr = [...array];
            let pagesBrks = [];
            for(let i = 0;i<=arr.length;i++){
              let slice = arr.splice(0,20);
              pagesBrks.push(slice);
            }
            this.setState({
              pages:[...pagesBrks]
            })
  }
  closeMenu=()=>{
    this.setState({
      toggle:true
    },()=>{
     this.handleToggle();
    })
  }
  handleToggle=()=>{
    const menu = document.querySelector("#sortMenu");
    if(this.state.fetchSuccess){
      this.setState((state)=>{
        return state.toggle ? {toggle:false}:{toggle:true}
      },()=>{
        if(this.state.toggle){
          document.body.className = "menu-view"; 
          menu.className = "push-in";
          
        }else{
          document.body.className = "";
          menu.className = "push-out";
          
        }
      })
    }
  }
  defaultProfileView=()=>{
    if(this.state.fetchSuccess){
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      //const userProfiles = response.records.profiles
      if(!this.state.profiles){
        this.setState({
          fetchSuccess:false
        });
        return null
      }
      else{let arr = [...this.state.profiles];
        let pagesBrks = [];
        for(let i = 0;i<=arr.length;i++){
          let slice = arr.splice(0,20);
          pagesBrks.push(slice);
        }    
        this.setState({
          profiles:[...this.state.profiles],
          pages:[...pagesBrks],
          action:null,
          searchInput:'',
          fetchSuccess:true,
          isLoading:false,
          sort:null,
        })}

    }
     
    
    else{this.fetchRecords();}
    
  }
  handleSort = (e) =>{ this.closeMenu();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    let value = e.toLowerCase();
    let sortType = null;
    let sortResults = [...this.state.profiles]
      .filter(user=>{
        let gender = user.Gender.toLowerCase();
        let card = user.CreditCardType.toLowerCase();
        let payment = user.PaymentMethod.toLowerCase(); 
        if(gender.includes(value)){
          sortType = ["Gender",`${value}`];
          return true;
        }
        if(card.includes(value)){
          sortType = ["Credit Card Type",`${value}`];
          return true;
        }
        if(payment.includes(value)){
          sortType = ["Payment Method",`${value}`];
          return true;
        }
        return false;
        } 
    );
    this.setState({
      sort:sortType,
      action: "Sort",
      searchInput:'',
    },()=>this.renderPage(sortResults))
      
  }
  fetchRecords = async()=>{
    const response = await fetch('https://api.enye.tech/v1/challenge/records');
    const data = await response.json();
    const userProfiles = data.records.profiles;
    let arr = [...userProfiles];
    let pagesBrks = [];
    for(let i = 0;i<=arr.length;i++){
      let slice = arr.splice(0,20);
      pagesBrks.push(slice);
    }
    this.setState({
      profiles:[...userProfiles],
      pages:[...pagesBrks],
    },()=>{
      if(this.state.profiles.length>1){
        this.setState({fetchSuccess:true})
      }
    })
    
  }   

  searchSort=()=>{
    let sort;
    if(this.state.sort){
      sort = <span className="search-sort">Showing results sorted by {`${this.state.sort[0]} : "${this.state.sort[1]}"`}</span>
    }
    let search = <span className="search-sort">Showing search results for {`"${this.state.searchInput}"`}</span>
    
    return this.state.action === "search" ? search : sort;
  }

  componentDidMount(){
      this.defaultProfileView();
  }


  render(){
    const {toggle} = this.state
  return (
 
    <div className="App" >
      
      <div className="navbar" > 
        <header className="header" onClick={this.closeMenu}> Patient Profiles </header>
       {this.state.fetchSuccess? 
       <>
       <NavButton id="nav-button" toggle={toggle?true:false} onClick={this.handleToggle}>
          <FontAwesomeIcon icon={this.state.toggle?faTimes:faBars}/>
        </NavButton>
          
        <nav id="sortMenu" >
          <h2>Filter by</h2>
           <CreateSortOptions profiles={this.state.profiles} 
          handleSort={this.handleSort}/> 
          <div id="clear-filter" className="dropdown">
            <button onClick={()=>{
              this.defaultProfileView();
              this.closeMenu()}}>
             Clear filters <FontAwesomeIcon icon={faTimes}/>
            </button>
          </div>
        </nav>
        </>
        : null}

      </div>
         
      <form method="post" 
        onSubmit={(e)=>{
          e.preventDefault();
          this.defaultProfileView();
        }}
        onClick={this.closeMenu}>
        <label htmlFor="searchBar">
          <FontAwesomeIcon icon={faSearch} size="lg"/>
        </label>
          
        <input id="searchBar" type="text" placeholder="Search by name" value={this.state.searchInput} onChange={this.handleSearch}
        className="search-input" autoComplete="off"/>
        {this.state.searchInput !==""?<button >
          <FontAwesomeIcon icon={faTimes}/>
          </button>:null}
      </form>

    <section id="profile_container" onClick={this.closeMenu}>
      {this.state.action?this.searchSort():null}
      {this.state.fetchSuccess?<Pages pages={this.state.pages} records={this.state.profiles}/>: <h1>Loading...</h1>}
    </section>
      <BackToTop id="backToTop" onClick={backToTopFunc}><FontAwesomeIcon icon={faArrowUp}/></BackToTop>
    </div>

  );
}
}

export default App;
