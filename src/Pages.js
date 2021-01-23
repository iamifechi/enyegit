import React,{useState}from 'react';
import styled,{css} from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyBWzinOeh3ezDj0woIV4N1PTMbEpuQa_9M");
Geocode.setLanguage("en");
Geocode.enableDebug();
const getLocation = (lat,lng)=>{
  Geocode.fromLatLng(lat,lng).then(
    response => {
      const address = response.results[0].formatted_address;
      console.log("Address",address)
      return address;
    },
    error => {
      console.error(error);
    }
  );
}

library.add(fas);

const Button = styled.button`
    padding:10px 15px;
    font-family:'open sans',sans-serif;
    font-weight:600;
    font-size: 16px;
    margin:5px;
    padding:8px 15px;
    border:none;
    border-radius: 8px;
    background:whitesmoke;

    ${props=>props.active && css`
    color:white;
    background: #900C3F;
    `
}   

    :hover, :focus{
    color:white;
    background: #581845;
    transform:scale(1.1);
    }
    
    :hover{
        cursor:pointer;
    }

    :focus{
    outline:none;
    }
`



const Pages = (props) =>{

  const {pages} = props;

    const renderPage =(data)=>{
      if(data === undefined || data.length===0){
        return <h5>No results found...</h5>
      }
      return data.map((profile,index)=>{
        let location = getLocation(`${profile.Latitude}`,`${profile.Longitude}`)
        if(!location){
          location = "Not found"
        }
        return(
          <div key={`profile${index}`} 
            className={animate?"animate-opacity profile_cards":"profile_cards"}>
            <p className="name">{`${profile.FirstName}`}<span>{`${profile.LastName}`}</span></p>
            <p className="username">{profile.Username}</p>

            <ul id="contact-details" className="details">
              <li><FontAwesomeIcon icon="at"/>  {`${profile.UserName}`.toLowerCase()}</li>
              <li><FontAwesomeIcon icon="venus-mars"/>  {`${profile.Gender}`}</li>
              {/* contact details */}
              <li><FontAwesomeIcon icon="phone-alt"/>  {`${profile.PhoneNumber}`}</li>
              <li><FontAwesomeIcon icon="envelope"/>  {`${profile.Email}`.toLowerCase()}</li>
              <li><FontAwesomeIcon icon="globe"/>  {`${profile.DomainName}`.toLowerCase()}</li>
              
            </ul>
            <ul id="transaction-details" className="details">
              {/* Private details */}
              <li>
                <h6><FontAwesomeIcon icon="map-marker-alt"/> Location</h6>
                <p>{`${location}`}</p>
              </li>
              <li>
                <h6><FontAwesomeIcon icon="laptop-house"/> Mac-address</h6>
                <p>{`${profile.MacAddress}`}</p>
              </li>
              <li>
                <h6><FontAwesomeIcon icon="credit-card"/> {`${profile.CreditCardType}`}</h6>
                <p>{`${profile.CreditCardNumber}`}</p>
              </li>

              <li>
                <h6>Payment Method</h6>
                <p>{`${profile.PaymentMethod}`}</p>
              </li>
              <li className="footer">
                <p>Url: {`${profile.URL}`.toLowerCase()}</p>
                <p>Last seen: {`${profile.LastLogin}`}</p>
              </li>
            </ul>
          </div>
        )
      })
    }
    const [pageNum,setPageNum] = useState(0);
    const [animate,setAnimate] = useState(true);

    const createPageButtons =()=>{
      let buttonArr = [];
      if(pages.length===1){
        return null;
      }
      for(let i=1;i<=pages.length;i++){
        buttonArr.push(i);
      }

      return (
        <div id="pagination-buttons">
          {buttonArr.map((num,index)=>{
          return(
              <Button key={index} active={pageNum+1 === num?true:false}
               onClick={()=>{
                switchPage(num-1);               
              }}>
                {num}
              </Button>
          );
          })}
        </div>
      )
      
      
    }

    const switchPage=(pageNum)=>{
      setPageNum(pageNum);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      setAnimate(false);
      setTimeout(() => {
        setAnimate(true)
      }, 50);
    }


    return(
    <>
      {renderPage(pages[pageNum])}
      {createPageButtons()}
     </>   
    )
}

export default Pages