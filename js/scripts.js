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

function emailObject (email, type){
  this.email = email;
  this.type = type;
}

function addressObject(address, type){
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

    var { inputtedEmail, inputtedEmailType, inputtedAddress, inputtedAddressType, inputtedFirstName, inputtedLastName, inputtedPhoneNumber } = getInput();

    createEmailAndAddressObjects(inputtedEmail, inputtedEmailType, inputtedAddress, inputtedAddressType);

    resetFields();

    var newContact = new Contact(inputtedFirstName, inputtedLastName, inputtedPhoneNumber,emailArray, addressArray);
    //cleanup
    emailArray = [];
    addressArray = [];

    addressBook.addContact(newContact);
    displayContacts(addressBook);
  })

  $(".addresses").on("click","button",function(){
    let inputtedAddress = $("input#new-address").val();
    let inputtedAddressType = $(".addresses select").val();
    let newAddress = new addressObject(inputtedAddress, inputtedAddressType);
    addressArray.push(newAddress);
    $("input#new-address").val("");
  })

  $(".emails").on("click","button",function(){
    let inputtedEmail = $("input#new-email").val();
    let inputtedEmailType = $(".emails select").val();
    let newEmail = new emailObject(inputtedEmail, inputtedEmailType);
    emailArray.push(newEmail);
    $("input#new-email").val("");
  })

  //change address books when the user switches address books with the option menu
  $("#choose").change(function() {
    
    addressBook = addressBooks[ this.value.toLowerCase()];
    
    $("#contactstype").html(this.value + " ")
    $("#show-contact").hide();
    displayContacts(addressBook);
  });

  //when user clicks to create a customized address book
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


function createEmailAndAddressObjects(inputtedEmail, inputtedEmailType, inputtedAddress, inputtedAddressType) {
  var newEmail = new emailObject(inputtedEmail, inputtedEmailType);
  emailArray.push(newEmail);
  var newAddress = new addressObject(inputtedAddress, inputtedAddressType);
  addressArray.push(newAddress);
}

function getInput() {
  var inputtedFirstName = $("input#new-first-name").val();
  var inputtedLastName = $("input#new-last-name").val();
  var inputtedPhoneNumber = $("input#new-phone-number").val();
  var inputtedEmail = $("input#new-email").val();
  var inputtedEmailType = $(".emails select").val();
  var inputtedAddress = $("input#new-address").val();
  var inputtedAddressType = $(".addresses select").val();
  return { inputtedEmail, inputtedEmailType, inputtedAddress, inputtedAddressType, inputtedFirstName, inputtedLastName, inputtedPhoneNumber };
}

function resetFields() {
  $("input#new-first-name").val("");
  $("input#new-last-name").val("");
  $("input#new-phone-number").val("");
  $("input#new-email").val("");
  $("input#new-address").val("");
}


