function getDateStr (str) {
  const tempstr = str.split('-').slice(0, 3).join('-');
  const reverseDate = tempstr.split('T').slice(0, 1);
  return reverseDate;
}

function getTimeStr (str) {
  const tempstr = str.split('T').slice(1, 2);
  //console.log(tempstr.slice(0,4));
  //const time = tempstr.split('.').slice(0, 1);
  return tempstr;
}

function getData () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then((res) => {
      const stringifiedObject = JSON.stringify(res);
      const objects = JSON.parse(stringifiedObject);
      const table = document.getElementById('data-event');
      for (let i = 0; i < objects.filteredEvents.length; i++) {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        cell1.innerHTML = objects.filteredEvents[i].name;
        const Datestr = (objects.filteredEvents[i].date).toString();
        cell2.innerHTML = getDateStr(Datestr);
        cell3.innerHTML = getTimeStr(Datestr);
        cell4.innerHTML = objects.filteredEvents[i].roomNumber;
      }
    }
    );
}
getData();

function getDataForDelete () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then((res) => {
      const stringifiedObject = JSON.stringify(res);
      const objects = JSON.parse(stringifiedObject);
      const table = document.getElementById('del-data-event');
      for (const element of objects.filteredEvents) {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        cell1.innerHTML = element.name;
        const Datestr2 = (element.date).toString();
        cell2.innerHTML = getDateStr(Datestr2);
        cell3.innerHTML = getTimeStr(Datestr2);
        cell4.innerHTML = element.roomNumber;
        cell5.innerHTML = '<form action="/delete-event" method="post"><input type="hidden" id="eventId" name="eventId" value="' + element._id + '"><input type="submit" value="Event Löschen"></form>';
      }
    }
    );
}
getDataForDelete();

function getDataGuest () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then((res) => {
      const stringifiedObject = JSON.stringify(res);
      const objects = JSON.parse(stringifiedObject);
      const table = document.getElementById('data-guest');
      for (let i = 0; i < objects.filteredGuests.length; i++) {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        cell1.innerHTML = objects.filteredGuests[i].name;
        cell2.innerHTML = objects.filteredGuests[i].child;
        cell3.innerHTML = objects.filteredGuests[i].status;
      }
    }
    );
}
getDataGuest();

function getDataGuestForDelete () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then((res) => {
      const stringifiedObject = JSON.stringify(res);
      const objects = JSON.parse(stringifiedObject);
      const table = document.getElementById('del-data-guest');
      for (const element of objects.filteredGuests) {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        cell1.innerHTML = element.name;
        cell2.innerHTML = element.child;
        cell3.innerHTML = element.status;
        cell4.innerHTML = '<form action="/delete-gast" method="post"><input type="hidden" id="gastid" name="gastid" value="' + element._id + '"><input type="submit" value="Gast entfernen"></form>';
      }
    }
    );
}
getDataGuestForDelete();

async function sendData (data) {
  const response = await fetch('/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  console.log(result);
  return result;
}

/* async function sendDataForEvent (data) {
  const response = await fetch('/data-guest-event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const result = await response.json();
  console.log(result);
  return result;
} */


/* function "getDataTables()" needs check if seats avaible then countdown seats until no more remaining */

/*function checkIfSeatAvaible(seatsavaible) {
  
}*/

/* Change by miguel => instead of ".guests" --> ".tables" */

 /*function getDataTables () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then((res) => {
      const stringifiedObject = JSON.stringify(res);
      const objects = JSON.parse(stringifiedObject);
      const table = document.getElementById('data-table');
      for (let i = 0; i < objects.filteredEvents.length; i++) {
        for (let g = 0; g < objects.filteredEvents[i].tables.length; g++) {
          const row = table.insertRow();
          const cell1 = row.insertCell(0);
          const cell2 = row.insertCell(1);
          const cell3 = row.insertCell(2);
          const cell4 = row.insertCell(3);
          cell1.innerHTML = objects.filteredEvents[i].name;
          cell2.innerHTML = objects.filteredEvents[i].tables[g].number;
          cell3.innerHTML = objects.filteredEvents[i].tables[g].seatNumber.table; still bad 
          cell4.innerHTML = objects.filteredEvents[i].tables[g].seatNumber.seat; still bad 
        }
      }
    }
    );
}
getDataTables();*/

function getEventOptions () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then((res) => {
      const stringifiedObject = JSON.stringify(res);
      const objects = JSON.parse(stringifiedObject);
      if (objects.filteredGuests.length !== 0) {
        for (let i = 0; i < objects.filteredGuests.length; i++) {
          const selectGuestOptions = document.getElementById('gie');
          const opt = document.createElement('option');
          opt.value = objects.filteredGuests[i]._id;
          opt.innerHTML = objects.filteredGuests[i].name;
          selectGuestOptions.appendChild(opt);
        }
      }
      const guestObject = objects.filteredGuests[0];

      const selectEventOptions = document.getElementById('guestevent');
      let count = 0;
      for (let i = 0; i < objects.filteredEvents.length; i++) {
        let isTrue = false;
        for (let g = 0; g < objects.filteredEvents[i].seatingPlan.length; g++) {
          if (String(guestObject._id) === String(objects.filteredEvents[i].seatingPlan[g].seatedBy)) {
            isTrue = true;
          }
        }
        if (isTrue === false) {
          const opt = document.createElement('option');
          opt.value = objects.filteredEvents[i]._id;
          opt.innerHTML = objects.filteredEvents[i].name;
          selectEventOptions.appendChild(opt);
          count++;
        }
      }
      /* sendDataForEvent({ da: objects.filteredGuests[0]._id, dt: objects.filteredEvents[0]._id })
        .then(result => {
          console.log(result);
        })
        .catch(error => {
          console.error(error);
        }); */
      if (count > 0) {
        /* for (let i = 0; i < objects.filteredEvents.length; i++) {
          const selectTableOptions = document.getElementById('guestevent');
          const opt = document.createElement('option');
          opt.value = objects.filteredEvents[i]._id;
          opt.innerHTML = objects.filteredEvents[i].name;
          selectTableOptions.appendChild(opt);
        } */
        const selectRoomOptions = document.getElementById('rooms');
        let firstevent;
        for (let i = 0; i < objects.filteredEvents.length; i++) {
          if (String(objects.filteredEvents[i]._id) === String(selectEventOptions[0].value)) {
            firstevent = objects.filteredEvents[i];
            break;
          }
        }
        for (let i = 0; i < firstevent.roomNumber.length; i++) {
          const optRoom = document.createElement('option');
          console.log(firstevent.roomNumber[i] + ' ' + i);
          optRoom.value = firstevent.roomNumber[i];
          optRoom.innerHTML = firstevent.roomNumber[i];
          selectRoomOptions.appendChild(optRoom);
        }
        const roomnumber = firstevent.roomNumber[0];
        let room;
        for (let i = 0; i < objects.rooms.length; i++) {
          if (objects.rooms[i].number === roomnumber) {
            room = objects.rooms[i];
            break;
          }
        }
        const selectTableOptions = document.getElementById('seatTable');
        for (let i = 0; i < room.tables.length; i++) {
          const optTable = document.createElement('option');
          optTable.value = room.tables[i].number;
          optTable.innerHTML = i + 1;
          selectTableOptions.appendChild(optTable);
        }
        const selectSeatOptions = document.getElementById('seatSeat');
        selectSeatOptions.options.length = 0;
        const listOfAvailableSeats = [];
        console.log(firstevent);
        console.log(firstevent.seatingPlan.length);
        for (let i = 0; i < firstevent.seatingPlan.length; i++) {
          console.log(firstevent.seatingPlan[0].seatNumber);
          listOfAvailableSeats.push(firstevent.seatingPlan[i].seatNumber);
        }
        console.log(listOfAvailableSeats);
        for (let i = 0; i < room.tables[0].seatsAvailable; i++) {
          let isTrue1 = false;
          for (let g = 0; g < listOfAvailableSeats.length; g++) {
            if (Number(listOfAvailableSeats[g]) === Number(i + 1)) {
              isTrue1 = true;
            }
          }
          if (isTrue1 === false) {
            const optSeat = document.createElement('option');
            const seatData = i + 1;
            optSeat.value = seatData;
            optSeat.innerHTML = i + 1;
            selectSeatOptions.appendChild(optSeat);
          }
        }
      }
    }
    );
}
getEventOptions();

// Room options for event form

/* function getEventRoomOptions () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then((res) => {
      const stringifiedObject = JSON.stringify(res);
      const objects = JSON.parse(stringifiedObject);
      if (objects.rooms.length !== 0) {
        for (let i = 0; i < objects.rooms.length; i++) {
          const selectRoomOptions = document.getElementById('room');
          const opt = document.createElement('option');
          opt.value = objects.rooms[i].number;
          opt.innerHTML = objects.rooms[i].number;
          selectRoomOptions.appendChild(opt);
        }
      }
    }
    );
}
getEventRoomOptions(); */

window.onload = function () {
  // listen to changes in Event selector

  const selectedOption = document.getElementById('guestevent');

  selectedOption.addEventListener('change', function (event) {
    fetch('/api/dataEvent')
      .then((res) => res.json())
      .then((res) => {
        const stringifiedObject = JSON.stringify(res);
        const objects = JSON.parse(stringifiedObject);
        let roomnumber;
        const selectElement = event.target;
        const selectedIndex = selectElement.selectedIndex;
        const selectedOption = selectElement.options[selectedIndex];
        const selectedValue = selectedOption.value;
        let selectedEvent;
        let firstevent;
        for (let i = 0; i < objects.filteredEvents.length; i++) {
          if (String(selectedValue) === String(objects.filteredEvents[i]._id)) {
            firstevent = objects.filteredEvents[i];
            roomnumber = objects.filteredEvents[i].roomNumber[0];
            selectedEvent = objects.filteredEvents[i];
            break;
          }
        }
        const selectRoomOptions = document.getElementById('rooms');
        selectRoomOptions.options.length = 0;
        for (let i = 0; i < selectedEvent.roomNumber.length; i++) {
          const optRoom = document.createElement('option');
          optRoom.value = selectedEvent.roomNumber[i];
          optRoom.innerHTML = selectedEvent.roomNumber[i];
          selectRoomOptions.appendChild(optRoom);
        }
        let room;
        for (let i = 0; i < objects.rooms.length; i++) {
          if (objects.rooms[i].number === roomnumber) {
            room = objects.rooms[i];
            break;
          }
        }
        const selectTableOptions = document.getElementById('seatTable');
        selectTableOptions.options.length = 0;
        for (let i = 0; i < room.tables.length; i++) {
          const optTable = document.createElement('option');
          optTable.value = room.tables[i].number;
          optTable.innerHTML = i + 1;
          selectTableOptions.appendChild(optTable);
        }
        const selectSeatOptions = document.getElementById('seatSeat');
        selectSeatOptions.options.length = 0;
        const listOfAvailableSeats = [];
        for (let i = 0; i < firstevent.seatingPlan.length; i++) {
          console.log(firstevent.seatingPlan[0].seatNumber);
          listOfAvailableSeats.push(firstevent.seatingPlan[i].seatNumber);
        }
        console.log(listOfAvailableSeats);
        for (let i = 0; i < room.tables[0].seatsAvailable; i++) {
          let isTrue1 = false;
          for (let g = 0; g < listOfAvailableSeats.length; g++) {
            if (Number(listOfAvailableSeats[g]) === Number(i + 1)) {
              isTrue1 = true;
            }
          }
          if (isTrue1 === false) {
            const optSeat = document.createElement('option');
            const seatData = i + 1;
            optSeat.value = seatData;
            optSeat.innerHTML = i + 1;
            selectSeatOptions.appendChild(optSeat);
          }
        }
      }
      );
  });

  // listen to changes in Guest selector

  const selectedGuest = document.getElementById('gie');

  selectedGuest.addEventListener('change', function (event) {
    fetch('/api/dataEvent')
      .then((res) => res.json())
      .then((res) => {
        const stringifiedObject = JSON.stringify(res);
        const objects = JSON.parse(stringifiedObject);
        const selectElement = event.target;
        const selectedIndex = selectElement.selectedIndex;
        const selectedOption = selectElement.options[selectedIndex];
        const selectedValue = selectedOption.value;
        const guestObject = selectedValue;
        const selectEventOptions = document.getElementById('guestevent');
        selectEventOptions.options.length = 0;
        let firstevent;
        for (let i = 0; i < objects.filteredEvents.length; i++) {
          let isTrue = false;
          for (let g = 0; g < objects.filteredEvents[i].seatingPlan.length; g++) {
            if (String(guestObject) === String(objects.filteredEvents[i].seatingPlan[g].seatedBy)) {
              isTrue = true;
            }
          }
          if (isTrue === false) {
            const opt = document.createElement('option');
            opt.value = objects.filteredEvents[i]._id;
            opt.innerHTML = objects.filteredEvents[i].name;
            selectEventOptions.appendChild(opt);
          }
        }
        let selectedEvent;
        if (typeof selectEventOptions[0] !== 'undefined') {
          for (let i = 0; i < objects.filteredEvents.length; i++) {
            if (String(selectEventOptions[0].value) === String(objects.filteredEvents[i]._id)) {
              firstevent = objects.filteredEvents[i];
              selectedEvent = objects.filteredEvents[i];
            }
          }
          const roomnumber = selectedEvent.roomNumber[0];
          const selectRoomOptions = document.getElementById('rooms');
          selectRoomOptions.options.length = 0;
          for (let i = 0; i < selectedEvent.roomNumber.length; i++) {
            const optRoom = document.createElement('option');
            optRoom.value = selectedEvent.roomNumber[i];
            optRoom.innerHTML = selectedEvent.roomNumber[i];
            selectRoomOptions.appendChild(optRoom);
          }
          let room;
          for (let i = 0; i < objects.rooms.length; i++) {
            if (objects.rooms[i].number === roomnumber) {
              room = objects.rooms[i];
              break;
            }
          }
          const selectTableOptions = document.getElementById('seatTable');
          selectTableOptions.options.length = 0;
          for (let i = 0; i < room.tables.length; i++) {
            const optTable = document.createElement('option');
            optTable.value = room.tables[i].number;
            optTable.innerHTML = i + 1;
            selectTableOptions.appendChild(optTable);
          }
          const selectSeatOptions = document.getElementById('seatSeat');
          selectSeatOptions.options.length = 0;
          const listOfAvailableSeats = [];
          for (let i = 0; i < firstevent.seatingPlan.length; i++) {
            console.log(firstevent.seatingPlan[0].seatNumber);
            listOfAvailableSeats.push(firstevent.seatingPlan[i].seatNumber);
          }
          console.log(listOfAvailableSeats);
          for (let i = 0; i < room.tables[0].seatsAvailable; i++) {
            let isTrue1 = false;
            for (let g = 0; g < listOfAvailableSeats.length; g++) {
              if (Number(listOfAvailableSeats[g]) === Number(i + 1)) {
                isTrue1 = true;
              }
            }
            if (isTrue1 === false) {
              const optSeat = document.createElement('option');
              const seatData = i + 1;
              optSeat.value = seatData;
              optSeat.innerHTML = i + 1;
              selectSeatOptions.appendChild(optSeat);
            }
          }
        } else {
          const selectRoomOptions = document.getElementById('rooms');
          selectRoomOptions.options.length = 0;
          const selectTableOptions = document.getElementById('seatTable');
          selectTableOptions.options.length = 0;
          const selectSeatOptions = document.getElementById('seatSeat');
          selectSeatOptions.options.length = 0;
        }
      }
      );
  });

  // listen to changes in Room selector

  const selectedOptionRoom = document.getElementById('rooms');

  selectedOptionRoom.addEventListener('change', function (rooms) {
    fetch('/api/dataEvent')
      .then((res) => res.json())
      .then((res) => {
        const stringifiedObject = JSON.stringify(res);
        const objects = JSON.parse(stringifiedObject);
        const selectElement = rooms.target;
        const selectedIndex = selectElement.selectedIndex;
        const selectedOption = selectElement.options[selectedIndex];
        const selectedValue = selectedOption.value;
        let room;
        for (let i = 0; i < objects.rooms.length; i++) {
          if (Number(objects.rooms[i].number) === Number(selectedValue)) {
            room = objects.rooms[i];
            break;
          }
        }
        const selectTableOptions = document.getElementById('seatTable');
        selectTableOptions.options.length = 0;
        for (let i = 0; i < room.tables.length; i++) {
          const optTable = document.createElement('option');
          optTable.value = room.tables[i].number;
          optTable.innerHTML = i + 1;
          selectTableOptions.appendChild(optTable);
        }
        const form = document.getElementById('event-form');
        console.log(form.elements);
        let firstevent;
        for (let i = 0; i < objects.filteredEvents.length; i++) {
          if (String(form.elements.guestevent.value) === String(objects.filteredEvents[i]._id)) {
            firstevent = objects.filteredEvents[i];
          }
        }
        const selectSeatOptions = document.getElementById('seatSeat');
        selectSeatOptions.options.length = 0;
        const listOfAvailableSeats = [];
        for (let i = 0; i < firstevent.seatingPlan.length; i++) {
          console.log(firstevent.seatingPlan[0].seatNumber);
          listOfAvailableSeats.push(firstevent.seatingPlan[i].seatNumber);
        }
        console.log(listOfAvailableSeats);
        for (let i = 0; i < room.tables[0].seatsAvailable; i++) {
          let isTrue1 = false;
          for (let g = 0; g < listOfAvailableSeats.length; g++) {
            if (Number(listOfAvailableSeats[g]) === Number(i + 1)) {
              isTrue1 = true;
            }
          }
          if (isTrue1 === false) {
            const optSeat = document.createElement('option');
            const seatData = i + 1;
            optSeat.value = seatData;
            optSeat.innerHTML = i + 1;
            selectSeatOptions.appendChild(optSeat);
          }
        }
      }
      );
  });

  // listen to changes in table selector

  const selectedOptionTable = document.getElementById('seatTable');

  selectedOptionTable.addEventListener('change', function (tables) {
    fetch('/api/dataEvent')
      .then((res) => res.json())
      .then((res) => {
        const stringifiedObject = JSON.stringify(res);
        const objects = JSON.parse(stringifiedObject);
        const selectElement = tables.target;
        const selectedIndex = selectElement.selectedIndex;
        const selectedOption = selectElement.options[selectedIndex];
        const selectedValue = selectedOption.value;
        const selectSeatOptions = document.getElementById('seatSeat');
        selectSeatOptions.options.length = 0;
        // let targetedTable;
        let roomnum;
        for (let i = 0; i < objects.rooms.length; i++) {
          for (let g = 0; g < objects.rooms[i].tables.length; g++) {
            if (Number(selectedValue) === Number(objects.rooms[i].tables[g].number)) {
              // targetedTable = objects.rooms[i].tables[g];
              roomnum = objects.rooms[i];
              break;
            }
          }
        }
        const selectTableOptions = document.getElementById('seatTable');
        selectTableOptions.options.length = 0;
        for (let i = 0; i < roomnum.tables.length; i++) {
          const optTable = document.createElement('option');
          optTable.value = roomnum.tables[i].number;
          optTable.innerHTML = i + 1;
          selectTableOptions.appendChild(optTable);
        }
        const form = document.getElementById('event-form');
        console.log(form.elements);
        let firstevent;
        for (let i = 0; i < objects.filteredEvents.length; i++) {
          if (String(form.elements.guestevent.value) === String(objects.filteredEvents[i]._id)) {
            firstevent = objects.filteredEvents[i];
          }
        }
        const listOfAvailableSeats = [];
        for (let i = 0; i < firstevent.seatingPlan.length; i++) {
          console.log(firstevent.seatingPlan[0].seatNumber);
          listOfAvailableSeats.push(firstevent.seatingPlan[i].seatNumber);
        }
        for (let i = 0; i < roomnum.tables[0].seatsAvailable; i++) {
          let isTrue1 = false;
          for (let g = 0; g < listOfAvailableSeats.length; g++) {
            if (Number(listOfAvailableSeats[g]) === Number(i + 1)) {
              isTrue1 = true;
            }
          }
          if (isTrue1 === false) {
            const optSeat = document.createElement('option');
            const seatData = i + 1;
            optSeat.value = seatData;
            optSeat.innerHTML = i + 1;
            selectSeatOptions.appendChild(optSeat);
          }
        }
      }
      );
  });

  // date tag changes

  const dateTag = document.getElementById('edate');

  dateTag.addEventListener('change', function () {
    const div = document.getElementById('contain');
    div.innerHTML = '';
    fetch('/api/dataEvent')
      .then((res) => res.json())
      .then((res) => {
        const stringifiedObject = JSON.stringify(res);
        const objects = JSON.parse(stringifiedObject);
        const input = document.getElementById('edate');
        const value = input.value;
        console.log(value);
        let isTrue = false;
        const dat = new Date(value);
        let listOfRoomsAvailable;
        if (objects.rooms.length !== 0) {
          sendData({ da: dat })
            .then(result => {
              listOfRoomsAvailable = result;
              if (listOfRoomsAvailable.rooms.length > 0) {
                isTrue = true;
              }
              if (listOfRoomsAvailable.rooms.length !== objects.rooms.length) {
                if (isTrue === true) {
                  const select = document.createElement('select');
                  select.id = 'roomforevent';
                  select.name = 'roomforevent';
                  select.multiple = true;
                  let isTrue1 = false;
                  for (let i = 0; i < objects.rooms.length; i++) {
                    for (let g = 0; g < listOfRoomsAvailable.rooms.length; g++) {
                      if (Number(listOfRoomsAvailable.rooms[g]) === Number(objects.rooms[i].number)) {
                        isTrue1 = true;
                      }
                    }
                    if (isTrue1 === false) {
                      const opt = document.createElement('option');
                      opt.value = objects.rooms[i].number;
                      opt.innerHTML = objects.rooms[i].number;
                      select.appendChild(opt);
                    }
                    isTrue1 = false;
                  }
                  const label = document.createElement('label');
                  label.innerHTML = 'Room';
                  const container = document.getElementById('contain');
                  container.appendChild(label);
                  container.appendChild(select);
                  const submitButton = document.createElement('input');
                  submitButton.type = 'submit';
                  submitButton.value = 'Submit';
                  container.appendChild(submitButton);
                } else {
                  if (objects.rooms.length !== 0) {
                    const select = document.createElement('select');
                    select.id = 'roomforevent';
                    select.name = 'roomforevent';
                    select.multiple = true;
                    for (let i = 0; i < objects.rooms.length; i++) {
                      const opt = document.createElement('option');
                      opt.value = objects.rooms[i].number;
                      opt.innerHTML = objects.rooms[i].number;
                      select.appendChild(opt);
                    }
                    const label = document.createElement('label');
                    label.innerHTML = 'Room';
                    const container = document.getElementById('contain');
                    container.appendChild(label);
                    container.appendChild(select);
                    const submitButton = document.createElement('input');
                    submitButton.type = 'submit';
                    submitButton.id = 'submit';
                    submitButton.value = 'Submit';
                    container.appendChild(submitButton);
                  }
                }
              }
            })
            .catch(error => {
              console.error(error);
            });
          /* const select = document.createElement('select');
          select.id = 'room';
          select.multiple = true;
          for (let i = 0; i < listOfRoomsAvailable.length; i++) {
            const opt = document.createElement('option');
            opt.value = listOfRoomsAvailable[i].number;
            opt.innerHTML = listOfRoomsAvailable[i].number;
            select.appendChild(opt);
          }
          const label = document.createElement('label');
          label.innerHTML = 'Room';
          const container = document.getElementById('contain');
          container.appendChild(label);
          container.appendChild(select); */
        }
      }
      );
  });

  /* const form = document.getElementById('event-form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const formElements = event.target.elements;
    console.log(formElements.roomforevent.selectedOptions);

    for (let i = 0; i < formElements.length; i++) {
      console.log(formElements[i].name + ':' + formElements[i].value);
    }
  }); */

  // submitting a form

  /* const form = document.querySelector('guestForm');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const child = document.getElementById('isChild').value;
    const status = document.getElementById('gstatus').value;
    const data = {
      name,
      child,
      status
    };
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(await response.json());
  }); */
};
