
// url base do projeto
const url = "https://jsonplaceholder.typicode.com/posts"; 

const loadingElement = document.querySelector( "#loading" );
const postsContainer = document.querySelector( "#posts-container" );


const postPage = document.querySelector( "#post" )
const postContainer = document.querySelector( "#post-container" );
const commentsContainer = document.querySelector( "#comments-container" );

const commentForm = document.querySelector( "#comment-form" );
const emailInput  = document.querySelector( "#email" );
const bodyInput   = document.querySelector( "#body" );

//Get id from URL => resolve erro de propriedade nula;
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get( "id" );

// GET all posts
async function getAllPosts() {

    const resp = await fetch( url ); // url => linha 3
    //console.log(resp);

    const data = await resp.json()

    //console.log(data);

    // Esconder o carregamento após receber os dados

    loadingElement.classList.add( "hide" );

    //Percorrendo os dados recebidos em "data";

    data.map((post) => {

        //Criando os elementos de forma "dinâmica";

        const div   = document.createElement("div");
        const title = document.createElement("h2" );
        const body  = document.createElement("p"  );
        const link  = document.createElement("a"  );

        // Colocando os dados recebidos dentro dos elementos criados a cima;

        title.innerText = post.title;
        body.innerText  = post.body;
        link.innerText  = "Ler"; //Definindo texto do link
        link.setAttribute("href", `/post.html?id=${post.id}`); //Colocando id do post na url para futura extração

        div.appendChild(title);
        div.appendChild(body );
        div.appendChild(link );
        postsContainer.appendChild( div )

         })
      }

      //GET individual post

      async function getPost( id ) {

        const [responsePost, responseComments] = await Promise.all([
            fetch(`${url}/${id}`),
            fetch(`${url}/${id}/comments`)
        ])

        const dataPost = await responsePost.json();

        const dataComments = await responseComments.json();


        loadingElement.classList.add( "hide" );
        postPage.classList.remove( "hide" );

        // Preenchendo divs com os conteúdos das requests a cima.
        const title = document.createElement( "h1" );
        const body = document.createElement( "p" );

        title.innerHTML = dataPost.title;
        body.innerHTML  = dataPost.body;

        postContainer.appendChild(title);
        postContainer.appendChild(body);

        //console.log(dataComments);
        //
        dataComments.map((comment) => {
            createComment(comment);
        });

      };

      //Criando comentários;

      function createComment(comment) {
 
            const div = document.createElement( "div" );
            const email = document.createElement( "h3" );
            const commentBody = document.createElement( "p" );

            email.innerHTML = comment.email;
            commentBody.innerHTML = comment.body;

            div.appendChild( email );
            div.appendChild( commentBody) ;

            commentsContainer.appendChild( div );
      }

      //Post a comment;
      async function postComment( comment ) {

        const resp = await fetch(`${url}/${postId}/comments`, {
            method: "POST",
            body: comment,
            headers: {
                "Content-type": "application/json",
            },
        });

        const data = await resp.json();

        createComment(data);
      };
      


    if(!postId){
        getAllPosts();
    } else {
        getPost(postId);

        commentForm.addEventListener( "submit", ( e ) => {
            e.preventDefault();

            let comment = {
                email: emailInput.value,
                body: bodyInput.value,
            };

            comment = JSON.stringify( comment );

            postComment(comment);
        });
    };

   