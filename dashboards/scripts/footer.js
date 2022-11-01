// This assumes we're using materialize!
let footerRef = document.createElement("footer");
footerRef.classList.add("page-footer", "purple" , "darken-4");
footerRef.innerHTML = 
`
  <div class="container">
    <div class="row">
      <div class="col l6 s12">
        <h5 class="white-text">Thanks for hanging!</h5>
        <p class="grey-text text-lighten-4">Did I really spend this much time on my footer?</p>
        <p class="grey-text text-lighten-4">Yes - yes, I did.</p>
        </div>
      <div class="col l4 offset-l2 s12">
        <h5 class="white-text">Links</h5>
        <ul>
          <li><a class="grey-text text-lighten-3" href="https://jasonthechiu.com">site</a></li>
          <li><a class="grey-text text-lighten-3" href="https://medium.com/@foreza">blog</a></li>
          <li><a class="grey-text text-lighten-3" href="https://www.linkedin.com/in/jasonthechiu/">linkedin</a></li>
          <li><a class="grey-text text-lighten-3" href="https://www.buymeacoffee.com/foreza">Coffee pls</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="footer-copyright">
    <div class="container">
      © 2022 Foreza
    </div>
  </div>
`
document.body.append(footerRef);