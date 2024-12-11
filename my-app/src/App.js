import React, { useEffect, useState } from 'react';
import './App.css'

const App = () => {
  const [posts, setPosts] = useState(null);
  const [filteredPost, setFilteredPost] = useState(null);
  const [pincode, setPincode] = useState("");
  const [hardPincode, setHardPincode] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] =useState(false);

  function fetchPosts(url){
    setLoading(true);
    fetch(url)
    .then(resolve => resolve.json())
    .then(data => {
      console.log(data);
      if(data[0].Status === 'Error'){
        alert(data[0].Message);
      }else{
        setPosts(data);
        setFilteredPost(data[0].PostOffice);
        setHardPincode(pincode);
      }
      setLoading(false);
    })
    .catch(error => {
      alert(error.message);
      setLoading(false);
    })
  }

  function hanldeLookup(e){
    e.preventDefault();
    if(pincode.length != 6){
      alert('Please enter 6 digit pincode');
      return;
    }
    // fetch the data from api
    const url = `https://api.postalpincode.in/pincode/${pincode}`;
    fetchPosts(url);
    setPincode("");
  }

  function handleFilter(e){
    const filterName = e.target.value;
    setFilter(filterName);
    if(filterName === ""){
      setFilteredPost(posts[0].PostOffice);
    }else{
      const newPosts = filteredPost.filter(post => post.Name.toLowerCase().includes(filterName.toLowerCase()));
      setFilteredPost(newPosts);
    }
  }

  return (
    <div id='app'>
      <section id='search'>
        <h1>Enter Pincode</h1>
        <form>
          <input type='text' placeholder='Pincode' value={pincode} onChange={(e)=>{setPincode(e.target.value)}}/>
          <button onClick={(e)=>{hanldeLookup(e)}}>{loading ? 'Loading...' : 'Lookup'}</button>
        </form>
      </section>
      {loading && <Loading/>}
      {
        posts && <section id='display'>
          <h1>Pincode: <span style={{fontWeight: '400'}}>{hardPincode}</span></h1>
          <h1>Message: <span style={{fontWeight: '400'}}>{posts[0].Message}</span></h1>
          <div>
            <input type='text' id='filter' placeholder='Filter' value={filter} onChange={(e)=>{handleFilter(e)}}/>
          </div>
          <div id='posts-container'>
          {
            filteredPost && filteredPost.map((post, index) => {
              return <div className='post-box' key={index}>
                <p>Name: {post.Name}</p>
                <p>Branch Type: {post.BranchType}</p>
                <p>Delivery Status: {post.DeliveryStatus}</p>
                <p>District: {post.District}</p>
                <p>Division: {post.Division}</p>
              </div>
            })
          }
          </div>
        </section>
      }
    </div>
  );
}

export default App;


function Loading(){
  return (
    <div id='loading'></div>
  )
}