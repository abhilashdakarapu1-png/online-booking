const app=document.getElementById("app");

const seedEvents=[
 {
  id:"e1",
  title:"Avengers: Secret Wars",
  type:"Movie",
  date:"2026-10-05",
  time:"06:30 PM",
  venue:"PVR Cinemas, Vijayawada",
  price:220,
  totalSeats:36,
  emoji:"🎬"
 },
 {
  id:"e2",
  title:"Live Music Night",
  type:"Concert",
  date:"2026-10-12",
  time:"07:00 PM",
  venue:"A Convention Hall, Vijayawada",
  price:499,
  totalSeats:36,
  emoji:"🎵"
 },
 {
  id:"e3",
  title:"Cricket Championship",
  type:"Sports",
  date:"2026-10-20",
  time:"03:30 PM",
  venue:"Indira Gandhi Stadium",
  price:350,
  totalSeats:36,
  emoji:"🏏"
 }
];

function get(key,fallback){
  try{
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  }catch{
    return fallback;
  }
}

function set(key,val){
  localStorage.setItem(key,JSON.stringify(val));
}

if(!localStorage.getItem("events")){
  set("events",seedEvents);
}

const defaultAdmin={
  name:"Administrator",
  email:"admin@tickethub.com",
  password:"admin123",
  role:"admin"
};

let storedUsers=get("users",[]);

if(!Array.isArray(storedUsers)){
  storedUsers=[];
}

storedUsers=storedUsers
  .filter(
    u=>u &&
    typeof u.email==="string" &&
    typeof u.password==="string"
  )
  .map(
    u=>({
      ...u,
      email:u.email.trim().toLowerCase()
    })
  );

if(!storedUsers.some(u=>u.email===defaultAdmin.email)){
  storedUsers.unshift(defaultAdmin);
}

set("users",storedUsers);

if(!localStorage.getItem("bookings")){
  set("bookings",[]);
}

function current(){
  return get("currentUser",null);
}

function nav(){

  const u=current();

  return `
    <nav class="nav">

      <div class="brand">
        Ticket<span>Hub</span>
      </div>

      <div class="nav-actions">

        ${
          u
          ?
          `
          <button
            class="btn secondary small"
            onclick="go('${u.role==="admin"?"admin":"home"}')"
          >
            ${u.role==="admin"?"Admin Dashboard":"Browse Events"}
          </button>

          <button
            class="btn dark small"
            onclick="logout()"
          >
            Logout
          </button>
          `
          :
          `
          <button
            class="btn secondary small"
            onclick="go('login')"
          >
            Login
          </button>

          <button
            class="btn small"
            onclick="go('signup')"
          >
            Sign Up
          </button>
          `
        }

      </div>

    </nav>
  `;
}

function layout(content){

  app.innerHTML=
    nav()+
    `
      <main class="container">
        ${content}
      </main>

      <footer class="footer">
        TicketHub • Online Ticket Booking System • HTML + CSS + JavaScript + Local Storage
      </footer>
    `;
}

function go(page,params=""){
  location.hash=page+(params?"?"+params:"");
}

function logout(){
  localStorage.removeItem("currentUser");
  go("login");
}

function esc(s){
  return String(s).replace(
    /[&<>"']/g,
    m=>({
      "&":"&amp;",
      "<":"&lt;",
      ">":"&gt;",
      '"':"&quot;",
      "'":"&#039;"
    }[m])
  );
}


/* =========================
   USER HOME PAGE
========================= */

function home(){

  const events=get("events",[]);

  layout(`

    <section class="hero">

      <div>

        <h1>
          Book your next experience.
        </h1>

        <p>
          Discover movies, concerts and sports events,
          choose your seats and receive a digital ticket instantly.
        </p>

        <br>

        <button
          class="btn"
          onclick="document.getElementById('events').scrollIntoView()"
        >
          Explore Events
        </button>

      </div>

      <div class="hero-card">

        <h3>
          How it works
        </h3>

        <p>
          1. Browse an event<br>
          2. Select available seats<br>
          3. Confirm payment<br>
          4. Get your digital ticket
        </p>

      </div>

    </section>


    <section
      id="events"
      class="events"
    >

      <div class="section-title">

        <h2>
          Available Events
        </h2>

        <span class="muted">
          ${events.length} events
        </span>

      </div>

      <div class="grid">

        ${events.map(eventCard).join("")}

      </div>

    </section>

  `);
}

function eventCard(e){

  return `

    <article class="card event-card">

      <div class="event-img">
        ${e.emoji||"🎟️"}
      </div>

      <div class="event-body">

        <span class="muted">
          ${esc(e.type)}
        </span>

        <h3>
          ${esc(e.title)}
        </h3>

        <p class="muted">
          📅 ${esc(e.date)} • ${esc(e.time)}
          <br>
          📍 ${esc(e.venue)}
        </p>

        <div class="price">
          ₹${e.price}
        </div>

        <button
          class="btn"
          onclick="book('${e.id}')"
        >
          Select Seats
        </button>

      </div>

    </article>

  `;
}


/* =========================
   LOGIN / SIGNUP
========================= */

function auth(mode){

  const title=
    mode==="login"
    ?"Welcome back"
    :"Create your account";

  layout(`

    <div class="form-wrap">

      <div class="card">

        <h2>
          ${title}
        </h2>

        <p class="muted">

          ${
            mode==="login"
            ?
            "Login with the email and password you created."
            :
            "Use your own email address and create a password for this account."
          }

        </p>

        <form
          onsubmit="${mode==="login"?"login(event)":"signup(event)"}"
        >

          ${
            mode==="signup"
            ?
            `
            <div class="field">

              <label>
                Full Name
              </label>

              <input
                id="name"
                required
              >

            </div>
            `
            :
            ""
          }


          <div class="field">

            <label>
              Email
            </label>

            <input
              id="email"
              type="email"
              required
            >

          </div>


          <div class="field">

            <label>
              Password
            </label>

            <input
              id="password"
              type="password"
              minlength="6"
              required
              placeholder="Create your own password"
            >

          </div>


          ${
            mode==="signup"
            ?
            `
            <div class="field">

              <label>
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                minlength="6"
                required
                placeholder="Re-enter your password"
              >

            </div>
            `
            :
            ""
          }


          ${
            mode==="signup"
            ?
            `
            <label
              style="display:flex;gap:8px;align-items:center;
              font-size:14px;margin:10px 0"
            >

              <input
                id="showPassword"
                type="checkbox"
                onchange="togglePasswordFields()"
              >

              Show password

            </label>
            `
            :
            ""
          }


          <button
            class="btn"
            style="width:100%"
          >
            ${mode==="login"?"Login":"Create Account"}
          </button>

        </form>


        <p
          style="margin-top:18px"
          class="muted"
        >

          ${
            mode==="login"
            ?
            `
            New user?

            <span
              class="link"
              onclick="go('signup')"
            >
              Create account
            </span>
            `
            :
            `
            Already registered?

            <span
              class="link"
              onclick="go('login')"
            >
              Login
            </span>
            `
          }

        </p>


        ${
          mode==="login"
          ?
          `
          <p
            class="muted"
            style="margin-top:15px"
          >
            Demo admin:
            admin@tickethub.com / admin123
          </p>

          <p
            class="muted"
            style="margin-top:8px"
          >
            If you tested an older version and login is failing,
            clear this site's Local Storage once and create a new account.
          </p>
          `
          :
          ""
        }

      </div>

    </div>

  `);
}


function signup(ev){

  ev.preventDefault();

  const users=get("users",[]);

  const email=emailVal().toLowerCase();

  const password=
    document.getElementById("password").value;

  const name=
    document.getElementById("name").value.trim();


  if(!name){
    return alert(
      "Please enter your full name."
    );
  }


  if(password.length<6){
    return alert(
      "Password must contain at least 6 characters."
    );
  }


  const confirmPassword=
    document.getElementById("confirmPassword").value;


  if(password!==confirmPassword){

    return alert(
      "Passwords do not match. Please enter the same password in both fields."
    );
  }


  if(users.some(u=>u.email===email)){

    return alert(
      "Email already registered. Please login instead."
    );
  }


  users.push({
    name,
    email,
    password,
    role:"user"
  });


  set("users",users);


  alert(
    "Account created successfully. Please login with the same email and password."
  );


  go("login");
}


function emailVal(){

  return document
    .getElementById("email")
    .value
    .trim()
    .toLowerCase();
}


function togglePasswordFields(){

  const type=
    document.getElementById("showPassword")?.checked
    ?"text"
    :"password";


  document.getElementById("password").type=type;


  if(document.getElementById("confirmPassword")){

    document.getElementById("confirmPassword").type=type;

  }
}


function login(ev){

  ev.preventDefault();

  const email=emailVal();

  const password=
    document.getElementById("password").value;


  if(!email || !password){

    return alert(
      "Please enter both email and password."
    );

  }


  const users=get("users",[]);


  const u=users.find(
    x=>
      String(x.email)
        .trim()
        .toLowerCase()===email
      &&
      String(x.password)===password
  );


  if(!u){

    const emailExists=
      users.some(
        x=>
          String(x.email)
            .trim()
            .toLowerCase()===email
      );


    return alert(
      emailExists
      ?
      "Password is incorrect. Please enter the password you used during signup."
      :
      "Email is not registered. Please create an account first."
    );

  }


  set("currentUser",u);


  go(
    u.role==="admin"
    ?"admin"
    :"home"
  );
}


/* =========================
   SEAT BOOKING
========================= */

function book(id){

  if(!current()){
    return go("login");
  }


  const e=
    get("events",[])
      .find(x=>x.id===id);


  if(!e){
    return;
  }


  const bookings=
    get("bookings",[]);


  const booked=
    bookings
      .filter(b=>b.eventId===id)
      .flatMap(b=>b.seats);


  let selected=[];


  const seats=
    Array.from(
      {length:e.totalSeats},
      (_,i)=>i+1
    );


  layout(`

    <div class="section-title">

      <div>

        <h2>
          ${esc(e.title)}
        </h2>

        <p class="muted">
          ${esc(e.date)} •
          ${esc(e.time)} •
          ${esc(e.venue)}
        </p>

      </div>


      <button
        class="btn secondary"
        onclick="go('home')"
      >
        Back
      </button>

    </div>


    <div class="card">

      <div class="screen">
        SCREEN / STAGE
      </div>


      <div class="seat-grid">

        ${
          seats.map(
            n=>
              `
              <button
                class="seat ${booked.includes(n)?"booked":""}"
                ${booked.includes(n)?"disabled":""}
                onclick="toggleSeat(${n},this)"
              >
                ${n}
              </button>
              `
          ).join("")
        }

      </div>


      <div class="summary">

        <p>
          Selected:
          <strong id="selectedSeats">
            None
          </strong>
        </p>


        <p>
          Total:
          <strong id="total">
            ₹0
          </strong>
        </p>


        <button
          class="btn"
          onclick="confirmBooking('${e.id}')"
        >
          Continue to Payment
        </button>

      </div>

    </div>

  `);


  window._booking={
    eventId:id,
    selected
  };
}


function toggleSeat(n,el){

  if(el.classList.contains("booked"))
    return;


  const s=
    window._booking.selected;


  const i=s.indexOf(n);


  if(i>=0){

    s.splice(i,1);
    el.classList.remove("selected");

  }else{

    s.push(n);
    el.classList.add("selected");

  }


  updateSummary();
}


function updateSummary(){

  const b=window._booking;


  const e=
    get("events",[])
      .find(x=>x.id===b.eventId);


  document.getElementById("selectedSeats")
    .textContent=
      b.selected.length
      ?
      b.selected
        .sort((a,b)=>a-b)
        .join(", ")
      :
      "None";


  document.getElementById("total")
    .textContent=
      "₹"+
      (
        b.selected.length*
        e.price
      );

}


/* =========================
   UPI PAYMENT
========================= */

function showPayment(id){

  const b=window._booking;


  if(!b || !b.selected.length){

    return alert(
      "Please select at least one seat."
    );

  }


  const e=
    get("events",[])
      .find(x=>x.id===id);


  const amount=
    b.selected.length*e.price;


  const upiId=
    "mallabhathulatrivikram@okicici";


  const payee=
    "Mallabhathula TRIVIKRAM";


  const upiUrl=
    `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payee)}&am=${amount}&cu=INR&tn=${encodeURIComponent("TicketHub "+e.title)}`;


  layout(`

    <div class="section-title">

      <div>

        <h2>
          Secure UPI Payment
        </h2>

        <p class="muted">
          ${esc(e.title)}
          • Seats:
          ${b.selected.join(", ")}
        </p>

      </div>


      <button
        class="btn secondary"
        onclick="book('${id}')"
      >
        Back
      </button>

    </div>


    <div class="payment-grid">


      <div class="card payment-card">

        <h3>
          Scan & Pay
        </h3>


        <p class="muted">

          Scan this QR with
          Google Pay, PhonePe,
          Paytm or another UPI app.

        </p>


        <img
          src="payment-qr.jpg"
          class="qr-image"
          alt="UPI payment QR code"
        >


        <p class="upi-id">
          UPI ID:
          ${upiId}
        </p>


        <p class="payment-amount">
          ₹${amount}
        </p>


        <a
          class="btn pay-link"
          href="${upiUrl}"
        >
          Open UPI App & Pay ₹${amount}
        </a>

      </div>


      <div class="card">

        <h3>
          Booking Summary
        </h3>

        <br>


        <p>
          <b>Event:</b>
          ${esc(e.title)}
        </p>


        <p>
          <b>Date:</b>
          ${esc(e.date)}
        </p>


        <p>
          <b>Time:</b>
          ${esc(e.time)}
        </p>


        <p>
          <b>Seats:</b>
          ${b.selected.join(", ")}
        </p>


        <p>
          <b>Amount:</b>
          ₹${amount}
        </p>


        <hr
          style="margin:20px 0"
        >


        <div class="notice">

          After completing the UPI payment,
          click the button below to generate
          your TicketHub ticket.

        </div>


        <button
          class="btn"
          style="width:100%"
          onclick="completePayment('${id}')"
        >
          I Have Completed Payment
        </button>


        <p
          class="muted"
          style="margin-top:12px"
        >
          This SDC version cannot independently
          verify a UPI transaction using only
          HTML, CSS and JavaScript.

        </p>

      </div>

    </div>

  `);
}


function completePayment(id){

  const b=window._booking;


  if(!b || !b.selected.length)
    return;


  const e=
    get("events",[])
      .find(x=>x.id===id);


  const amount=
    b.selected.length*
    e.price;


  const bookings=
    get("bookings",[]);


  const ticket=
    "TH"+
    Date.now()
      .toString()
      .slice(-8);


  bookings.push({

    id:ticket,

    eventId:id,

    userEmail:
      current().email,

    userName:
      current().name,

    seats:[
      ...b.selected
    ],

    amount,

    status:
      "Paid / Confirmed",

    paymentMethod:
      "UPI",

    upiId:
      "mallabhathulatrivikram@okicici",

    bookedAt:
      new Date().toLocaleString()

  });


  set(
    "bookings",
    bookings
  );


  go(
    "ticket",
    ticket
  );
}


function confirmBooking(id){

  showPayment(id);

}


/* =========================
   DIGITAL TICKET
========================= */

function ticket(id){

  const b=
    get("bookings",[])
      .find(x=>x.id===id);


  if(!b){
    return go("home");
  }


  const e=
    get("events",[])
      .find(x=>x.id===b.eventId);


  layout(`

    <div class="section-title">

      <h2>
        Digital Ticket
      </h2>


      <button
        class="btn secondary"
        onclick="go('mytickets')"
      >
        My Tickets
      </button>

    </div>


    <div class="card ticket">

      <h2>
        🎟️ TicketHub
      </h2>


      <hr
        style="margin:15px 0"
      >


      <h2>
        ${esc(e.title)}
      </h2>


      <p class="muted">

        ${esc(e.type)} •
        ${esc(e.date)} •
        ${esc(e.time)}

        <br>

        ${esc(e.venue)}

      </p>


      <br>


      <p>

        <b>Passenger:</b>
        ${esc(b.userName)}

        <br>

        <b>Seats:</b>
        ${b.seats.join(", ")}

        <br>

        <b>Amount:</b>
        ₹${b.amount}

        <br>

        <b>Ticket ID:</b>
        ${b.id}

        <br>

        <b>Status:</b>
        ${b.status}

      </p>


      <br>


      <button
        class="btn"
        onclick="window.print()"
      >
        Print Ticket
      </button>

    </div>

  `);
}


/* =========================
   MY TICKETS
========================= */

function mytickets(){

  if(!current()){
    return go("login");
  }


  const bs=
    get("bookings",[])
      .filter(
        b=>
          b.userEmail===
          current().email
      );


  layout(`

    <div class="section-title">

      <h2>
        My Tickets
      </h2>


      <button
        class="btn"
        onclick="go('home')"
      >
        Browse Events
      </button>

    </div>


    ${
      bs.length
      ?
      `
      <div class="grid">

        ${
          bs.map(
            b=>{

              const e=
                get("events",[])
                  .find(
                    x=>
                      x.id===
                      b.eventId
                  );


              return `

                <div class="card">

                  <h3>
                    ${esc(
                      e?.title||
                      "Event"
                    )}
                  </h3>


                  <p class="muted">

                    ${e?.date||""}
                    •
                    ${e?.time||""}

                    <br>

                    Seats:
                    ${b.seats.join(", ")}

                  </p>


                  <div class="price">
                    ₹${b.amount}
                  </div>


                  <button
                    class="btn small"
                    onclick="go('ticket','${b.id}')"
                  >
                    View Ticket
                  </button>

                </div>

              `;

            }
          ).join("")
        }

      </div>
      `
      :
      `
      <div class="card empty">
        No bookings yet.
      </div>
      `
    }

  `);
}


/* =========================
   ADMIN MODULE
========================= */

function admin(){

  if(current()?.role!=="admin"){
    return go("login");
  }


  const es=
    get("events",[]);


  const bs=
    get("bookings",[]);


  const revenue=
    bs.reduce(
      (a,b)=>a+b.amount,
      0
    );


  layout(`

    <div class="section-title">

      <h2>
        Admin Dashboard
      </h2>


      <button
        class="btn"
        onclick="go('addEvent')"
      >
        + Add Event
      </button>

    </div>


    <div class="stats">

      <div class="card stat">

        <span class="muted">
          Total Events
        </span>

        <strong>
          ${es.length}
        </strong>

      </div>


      <div class="card stat">

        <span class="muted">
          Tickets Sold
        </span>

        <strong>
          ${
            bs.reduce(
              (a,b)=>
                a+b.seats.length,
              0
            )
          }
        </strong>

      </div>


      <div class="card stat">

        <span class="muted">
          Revenue
        </span>

        <strong>
          ₹${revenue}
        </strong>

      </div>

    </div>


    <div class="card">

      <h3
        style="margin-bottom:15px"
      >
        Manage Events
      </h3>


      <div class="table-wrap">

        <table class="table">

          <tr>
            <th>Event</th>
            <th>Date</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>


          ${
            es.map(
              e=>

              `
              <tr>

                <td>
                  ${esc(e.title)}
                </td>

                <td>
                  ${e.date}
                </td>

                <td>
                  ₹${e.price}
                </td>

                <td>

                  <button
                    class="btn secondary small"
                    onclick="editEvent('${e.id}')"
                  >
                    Edit
                  </button>


                  <button
                    class="btn danger small"
                    onclick="deleteEvent('${e.id}')"
                  >
                    Delete
                  </button>

                </td>

              </tr>
              `
            ).join("")
          }

        </table>

      </div>

    </div>


    <br>


    <div class="card">

      <h3
        style="margin-bottom:15px"
      >
        Recent Bookings
      </h3>


      <div class="table-wrap">

        <table class="table">

          <tr>

            <th>
              Ticket
            </th>

            <th>
              User
            </th>

            <th>
              Event
            </th>

            <th>
              Seats
            </th>

            <th>
              Amount
            </th>

          </tr>


          ${
            bs
              .slice()
              .reverse()
              .map(
                b=>

                `
                <tr>

                  <td>
                    ${b.id}
                  </td>

                  <td>
                    ${esc(b.userName)}
                  </td>

                  <td>
                    ${
                      esc(
                        es.find(
                          e=>
                            e.id===
                            b.eventId
                        )?.title||
                        ""
                      )
                    }
                  </td>

                  <td>
                    ${b.seats.join(", ")}
                  </td>

                  <td>
                    ₹${b.amount}
                  </td>

                </tr>
                `
              ).join("")

              ||

              `
              <tr>
                <td colspan="5">
                  No bookings.
                </td>
              </tr>
              `
          }

        </table>

      </div>

    </div>

  `);
}


/* =========================
   ADD / EDIT EVENT
========================= */

function eventForm(id=null){

  if(current()?.role!=="admin"){
    return go("login");
  }


  const e=
    id
    ?
    get("events",[])
      .find(x=>x.id===id)
    :
    null;


  layout(`

    <div class="form-wrap">

      <div class="card">

        <h2>
          ${e?"Edit":"Add"} Event
        </h2>


        <form
          onsubmit="saveEvent(event,${e?`'${e.id}'`:"null"})"
        >


          ${
            [
              [
                "title",
                "Event Name",
                "text",
                e?.title||""
              ],
              [
                "date",
                "Date",
                "date",
                e?.date||""
              ],
              [
                "time",
                "Time",
                "text",
                e?.time||""
              ],
              [
                "venue",
                "Venue",
                "text",
                e?.venue||""
              ],
              [
                "price",
                "Ticket Price",
                "number",
                e?.price||200
              ],
              [
                "totalSeats",
                "Total Seats",
                "number",
                e?.totalSeats||36
              ],
              [
                "emoji",
                "Icon Emoji",
                "text",
                e?.emoji||"🎟️"
              ]
            ]
            .map(
              x=>

              `
              <div class="field">

                <label>
                  ${x[1]}
                </label>

                <input
                  id="${x[0]}"
                  type="${x[2]}"
                  value="${x[3]}"
                  required
                >

              </div>
              `
            )
            .join("")
          }


          <div class="field">

            <label>
              Type
            </label>

            <select id="type">

              <option
                ${e?.type==="Movie"?"selected":""}
              >
                Movie
              </option>

              <option
                ${e?.type==="Concert"?"selected":""}
              >
                Concert
              </option>

              <option
                ${e?.type==="Sports"?"selected":""}
              >
                Sports
              </option>

            </select>

          </div>


          <button class="btn">
            Save Event
          </button>


          <button
            type="button"
            class="btn secondary"
            onclick="go('admin')"
          >
            Cancel
          </button>


        </form>

      </div>

    </div>

  `);
}


function saveEvent(ev,id){

  ev.preventDefault();


  const es=
    get("events",[]);


  const obj={

    id:
      id||
      "e"+
      Date.now(),

    title:
      v("title"),

    type:
      v("type"),

    date:
      v("date"),

    time:
      v("time"),

    venue:
      v("venue"),

    price:
      +v("price"),

    totalSeats:
      +v("totalSeats"),

    emoji:
      v("emoji")

  };


  const i=
    es.findIndex(
      e=>e.id===id
    );


  if(i>=0){
    es[i]=obj;
  }else{
    es.push(obj);
  }


  set("events",es);


  go("admin");
}


function v(id){

  return document
    .getElementById(id)
    .value;

}


function deleteEvent(id){

  if(
    !confirm(
      "Delete this event?"
    )
  )
    return;


  set(
    "events",
    get("events",[])
      .filter(
        e=>e.id!==id
      )
  );


  go("admin");
}


function editEvent(id){

  eventForm(id);

}


/* =========================
   ROUTER
========================= */

function router(){

  const [
    page,
    q
  ]=
    location.hash
      .slice(1)
      .split("?");


  const p=
    page||
    "home";


  if(p==="login")
    auth("login");

  else if(p==="signup")
    auth("signup");

  else if(p==="home")
    home();

  else if(p==="book")
    book(
      new URLSearchParams(q)
        .get("id")
    );

  else if(p==="ticket")
    ticket(
      new URLSearchParams(q)
        .get("id")
    );

  else if(p==="mytickets")
    mytickets();

  else if(p==="admin")
    admin();

  else if(p==="addEvent")
    eventForm();

  else if(p==="editEvent")
    eventForm(
      new URLSearchParams(q)
        .get("id")
    );

  else
    home();
}


window.addEventListener(
  "hashchange",
  router
);


router();