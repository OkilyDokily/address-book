// Business Logic for AddressBook ---------
function AddressBook() {
  this.contacts = [];
  this.currentId = 0;
}

AddressBook.prototype.addContact = function(contact) {
  contact.id = this.assignId();
  this.contacts.push(contact);
}

AddressBook.prototype.assignId = function() {
  this.currentId += 1;
  return this.currentId;
}

AddressBook.prototype.findContact = function(id) {
  for (var i=0; i< this.contacts.length; i++) {
    if (this.contacts[i]) {    
      if (this.contacts[i].id == id) {
        return this.contacts[i];
      }
    }                         
  };
  return false;
}

AddressBook.prototype.deleteContact = function(id) {
  for (var i=0; i< this.contacts.length; i++) {
    if (this.contacts[i]) { 
      if (this.contacts[i].id == id) {
        delete this.contacts[i];
        return true;
      }
    } 
  };
  return false;
}


AddressBook.prototype.updateContact = function(id,contact) {
  for (var i=0; i< this.contacts.length; i++) {
    if (this.contacts[i]) { 
      if (this.contacts[i].id == id) {
        this.contacts[i] = contact;
        contact.id = i;
        return true;
      }
    } 
  };
  return false;
}
// Business Logic for Contacts ---------
function Contact(firstName, lastName, phoneNumber, emails, addresses) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.phoneNumber = phoneNumber;
  this.emails = emails;
  this.addresses = addresses;
}

Contact.prototype.fullName = function() {
  return this.firstName + " " + this.lastName;
}

function EmailObject (email, type){
  this.email = email;
  this.type = type;
}

function AddressObject(address, type){
  this.address = address;
  this.type = type;
}

//sadly global
var emailArray = [];
var addressArray = [];

var generalBook = new AddressBook();
var schoolBook = new AddressBook();
var workBook = new AddressBook();
var personBook = new AddressBook();
var addressBooks = {"general":generalBook,
                    "school": schoolBook,
                    "work": workBook,
                    "personal":personBook};
let addressBook = generalBook; 
// User Interface Logic ---------


function displayContacts(addressBookToDisplay) {
  var contactsList = $("ul#contacts");
  var htmlForContactInfo = "";
  addressBookToDisplay.contacts.forEach(function(contact) {
    htmlForContactInfo += "<li id=" + contact.id + ">" + contact.firstName + " " + contact.lastName + "</li>";
  });
  contactsList.html(htmlForContactInfo);
};

function showContact(contactId) {
  var contact = addressBook.findContact(contactId);
  $("#show-contact").show();
  $(".first-name").html(contact.firstName);
  $(".last-name").html(contact.lastName);
  $(".phone-number").html(contact.phoneNumber);
  
  createAddressAndEmailLists();
  
  var buttons = $("#buttons");
  buttons.empty();
  buttons.append("<button class='deleteButton' id=" + contact.id + ">Delete</button>");

  function createAddressAndEmailLists() {
    var emailHTML = "";
    contact.emails.forEach(function (email) {
      if (email.email) {
        emailHTML += "<li>" + email.email + " (" + email.type + ")" + "</li>";
      }
    });
    $("#emaillist").html(emailHTML);
    var addressHTML = "";
    contact.addresses.forEach(function (address) {
      if (address.address) {
        addressHTML += "<li>" + address.address + " (" + address.type + ")" + "</li>";
      }
    });
    $("#addresslist").html(addressHTML);
  }
}



function attachContactListeners() {
  $("ul#contacts").on("click", "li", function() {
    showContact(this.id);
  });

  $("#buttons").on("click", ".deleteButton", function() {
    addressBook.deleteContact(this.id);
    $("#show-contact").hide();
    displayContacts(addressBook);
  });
};



$(document).ready(function() {
  attachContactListeners(); 
  $("form#new-contact").submit(function(event) {
    event.preventDefault();

    var {inputtedFirstName, inputtedLastName, inputtedPhoneNumber } = getInput();


    resetFields();

    var newContact = new Contact(inputtedFirstName, inputtedLastName, inputtedPhoneNumber,emailArray, addressArray);
    //cleanup
    emailArray = [];
    addressArray = [];

    addressBook.addContact(newContact);
    displayContacts(addressBook);
  })

  //add extra form for extra addresses
  $(".newaddress").click(function(){
    console.log("ahhh")
    $(".addresses").last().after('<div class="form-group addresses"><select><option>Work</option><option>Personal</option><select><label' + '>Address</label><input type="text" class="form-control" class="new-address"></div>');
  })

  //add extra form for extra addresses
  $(".newemail").click(function(){
    $(".emails").last().after('<div class="form-group emails"><select><option>Work</option><option>Personal</option><select><label' + '>Email</label><input type="text" class="form-control" class="new-email"></div>');
  })

  //change address books when the user switches address books with the option menu
  $("#choose").change(function() {
    
    addressBook = addressBooks[ this.value.toLowerCase()];
    
    $("#contactstype").html(this.value + " ")
    $("#show-contact").hide();
    displayContacts(addressBook);
  });

  //when user clicks to create a customized address book and switch the ui to that book
  $("#newaddressbookbutton").click(function(){
    
    let newAddress  = $("#newaddressinput").val();
   

    //add address book to address books object before invoking the change event via jquery.
    //check if the name of the address books already exists.
    if (($("#choose option").filter(function() { return $(this).text() === newAddress }).length === 0))
    {
    $("#choose").append("<option>" + newAddress + "</option>");
    addressBooks[newAddress] = new AddressBook();

    //add address book to menu and change menu and then invoke the jquery change event.
    $("#choose option").filter(function() { return $(this).text() === newAddress }).prop('selected', true).change();
    }
  });

})


function getInput() {
  let inputtedFirstName = $("input#new-first-name").val();
  let inputtedLastName = $("input#new-last-name").val();
  let inputtedPhoneNumber = $("input#new-phone-number").val();
 
  //add  all address to address array
  $(".addresses").each(function(index,address){
    let input = $(this).children("input").val();
    let type = $(this).children("select").val();
    addressArray.push(new AddressObject(input, type));
  });

  //add all emails to email array
  $(".emails").each(function(index,email){
    let input = $(this).children("input").val();
    let type = $(this).children("select").val();
    emailArray.push(new EmailObject(input, type));
  });

  return { inputtedFirstName, inputtedLastName, inputtedPhoneNumber };
}

function resetFields() {
  $("input#new-first-name").val("");
  $("input#new-last-name").val("");
  $("input#new-phone-number").val("");
  $("input#new-email").val("");
  $("input#new-address").val("");

  $(".addresses").not(":last").remove();
  $(".emails").not(":last").remove();
}


