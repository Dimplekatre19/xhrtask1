const cl=console.log;
const cardcontainer=document.getElementById("cardcontainer");
const postform=document.getElementById("postform");
const titlecontrol= document.getElementById("titleid");
const contentcontrol=document.getElementById("contentid");
const useridcontrol=document.getElementById("UserId");
const loader=document.getElementById("loader");
const submitbtn=document.getElementById("submitbtn");
const updatebtn=document.getElementById("updatebtn");

const BASE_URL='https://jsonplaceholder.typicode.com';
const POST_URL=`${BASE_URL}/posts`;

const sweetalert=(msg,icon)=>{
    Swal.fire({
        title:msg,
        timer:2500,
        icon:icon
    })
}

let postArr=[];
const templating=(arr)=>{
        let result=``;
        arr.forEach(post => {
               result+=`
                <div class="col-md-4 mb-4">
              <div class="card postcard h-100" id="${post.id}">
                  <div class="card-header">
                    <h3 class="m-0">${post.title}</h3>
                  </div>
                  <div class="card-body">
                    <p class="m-0">${post.body}</p>
                  </div>
                  <div class="card-footer d-flex justify-content-between">
                   <button onclick="onEdit(this)" class="btn btn-sm btn-outline-primary">EDIT</button>
                   <button onclick="onDelete(this)" class="btn btn-sm btn-outline-danger">DELETE</button>
                  </div>
              </div>
            </div> 
               `
               cardcontainer.innerHTML=result;
        });
}




const makeApiCall=(methodname,apiUrl,msgbody=null)=>{
      if(msgbody){
          msgbody=JSON.stringify(msgbody);
      }
      loader.classList.remove("d-none");
  let xhr= new XMLHttpRequest();

  xhr.open(methodname,apiUrl);

  xhr.onload=function(){
     if(xhr.status>=200 && xhr.status<300){
          //callback function
          let data= JSON.parse(xhr.response);
           if(methodname==="GET" ){
              if(Array.isArray(data)){
                   templating(data);
                   sweetalert("POST IS FETCHED SUCCESSFULLY!!!","success");
              } else{
                 cl("patch data in form");
                 titlecontrol.value=data.title;
                 contentcontrol.value=data.body;
                 useridcontrol.value=data.userId;
                 submitbtn.classList.add("d-none");
                 updatebtn.classList.remove("d-none");
                 window.scrollTo({top:0,behavior:"smooth"});
                 
              }  
           }else if(methodname==="POST"){
                 let div =document.createElement('div');
                 div.className='col-md-4 mb-4';
                
                 let post=JSON.parse(msgbody);
                 post.id=data.id;
                 div.innerHTML=`
                  <div class="card postcard h-100" id="${post.id}">
                  <div class="card-header">
                    <h3 class="m-0">${post.title}</h3>
                  </div>
                  <div class="card-body">
                    <p class="m-0">${post.body}</p>
                  </div>
                  <div class="card-footer d-flex justify-content-between">
                   <button onclick="onEdit(this)" class="btn btn-sm btn-outline-primary">EDIT</button>
                   <button onclick="onDelete(this)"class="btn btn-sm btn-outline-danger">DELETE</button>
                  </div>
              </div>
                 `
             cardcontainer.prepend(div);
             sweetalert("POST IS ADDED SUCCESSFULLY!!!","success")
           }else if(methodname==="PATCH"){
               let newmsgbody= JSON.parse(msgbody);
               let cardId= newmsgbody.id;
               let card=[...document.getElementById(cardId).children];
                card[0].innerHTML=`<h3 class="m-0">${newmsgbody.title}</h3>`;
                card[1].innerHTML=`<p class="m-0">${newmsgbody.body}</p>`;
                updatebtn.classList.add("d-none");
                submitbtn.classList.remove("d-none");
                postform.reset();
                sweetalert("POST IS UPDATED SUCCESSFULLY!!!","success")
           }else if(methodname==="DELETE"){
                 let removeId= localStorage.getItem('removeId');
                 let card=document.getElementById(removeId).parentElement;
                 card.remove();
                 sweetalert("POST IS REMOVED SUCCESSFULLY!!!","success")
           }

     }  
     loader.classList.add("d-none");
  }

  xhr.send(msgbody);

}

makeApiCall("GET" ,POST_URL);

const onEdit=(ele)=>{
  let editId= ele.closest('.card').id;
  localStorage.setItem("editId",editId);



  let EDIT_URL=`${BASE_URL}/posts/${editId}`;

  makeApiCall("GET",EDIT_URL);

  
}

const onpostupdate=()=>{
  let updatedId= localStorage.getItem("editId");
     
  let updatedobj={
        title:titlecontrol.value,
        body:contentcontrol.value,
        userId:useridcontrol.value,
        id: updatedId
      }
  
      let UPDATE_URL=`${BASE_URL}/posts/${updatedId}`;

      makeApiCall("PATCH",UPDATE_URL,updatedobj);

}

    
const onpostadd=(eve)=>{
     eve.preventDefault();
     let newpost={
         title:titlecontrol.value,
         body:contentcontrol.value,
         userId:useridcontrol.value
     }
    
     makeApiCall("POST",POST_URL,newpost)
     postform.reset();

}

const onDelete=(ele)=>{

 
Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    let removeId= ele.closest('.card').id;

       localStorage.setItem("removeId", removeId);

       let REMOVE_URL = `${BASE_URL}/posts/${removeId}`;

       makeApiCall("DELETE",REMOVE_URL);
  }
});

  
}


postform.addEventListener("submit",onpostadd);
updatebtn.addEventListener("click",onpostupdate);