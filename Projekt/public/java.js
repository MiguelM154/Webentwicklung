function getDateStr (str) {
  const tempstr = str.split('-').slice(0, 3).join('-');
  const reverseDate = tempstr.split('T').slice(0, 1);
  return reverseDate;
}

function getTimeStr (str) {
  const tempstr = str.split('T').slice(1, 2);
  return tempstr;
}

function getData () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then((res) => {
      const stringifiedObject = JSON.stringify(res);
      const objects = JSON.parse(stringifiedObject);
      const table = document.getElementById('data-event');
      for (const element of objects.filteredEvents) {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        cell1.innerHTML = element.name;
        const Datestr = (element.date).toString();
        cell2.innerHTML = getDateStr(Datestr);
        cell3.innerHTML = getTimeStr(Datestr);
        cell4.innerHTML = element.roomNumber;
      }
    })
    .catch(err => {
      console.log(err);
    });
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
        cell5.innerHTML = '<form action="/delete-event" method="post"><input type="hidden" id="eventId" name="eventId" value="' + element._id + '"><input type="submit" value="Event L??schen"></form>';
      }
    })
    .catch(err => {
      console.log(err);
    });
}
getDataForDelete();

function getDataGuest () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then((res) => {
      const stringifiedObject = JSON.stringify(res);
      const objects = JSON.parse(stringifiedObject);
      const table = document.getElementById('data-guest');
      for (const element of objects.filteredGuests) {
        const row = table.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        cell1.innerHTML = element.name;
        cell2.innerHTML = element.child;
        cell3.innerHTML = element.status;
      }
    })
    .catch(err => {
      console.log(err);
    });
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
    })
    .catch(err => {
      console.log(err);
    });
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

function getDataTables () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then(async (res) => {
      const stringifiedObject = JSON.stringify(res);
      const objects = JSON.parse(stringifiedObject);
      const table = document.getElementById('data-table');
      const arrayOfGaeste = [];
      for (const getguest of objects.filteredGuests) {
        arrayOfGaeste[getguest._id] = getguest.name;
      }
      for (const element of objects.filteredEvents) {
        for (const key of element.seatingPlan) {
          const row = table.insertRow();
          const cell1 = row.insertCell(0);
          const cell2 = row.insertCell(1);
          const cell3 = row.insertCell(2);
          const cell4 = row.insertCell(3);
          const cell5 = row.insertCell(4);
          const cell6 = row.insertCell(5);
          cell1.innerHTML = element.name;
          cell2.innerHTML = arrayOfGaeste[key.seatedBy];
          cell3.innerHTML = key.tableNumber;
          cell4.innerHTML = key.typeoftableseat;
          cell5.innerHTML = key.tableform;
          cell6.innerHTML = key.seatNumber;
        }
      }
    })
    .catch(err => {
      console.log(err);
    });
}
getDataTables();

function getDataTablesForDelete () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then(async (res) => {
      const stringifiedObject = JSON.stringify(res);
      const objects = JSON.parse(stringifiedObject);
      const table = document.getElementById('del-data-table');
      const arrayOfGaeste = [];
      for (const getguest of objects.filteredGuests) {
        arrayOfGaeste[getguest._id] = getguest.name;
      }
      for (const element of objects.filteredEvents) {
        for (const key of element.seatingPlan) {
          const row = table.insertRow();
          const cell1 = row.insertCell(0);
          const cell2 = row.insertCell(1);
          const cell3 = row.insertCell(2);
          const cell4 = row.insertCell(3);
          const cell5 = row.insertCell(4);
          const cell6 = row.insertCell(5);
          const cell7 = row.insertCell(6);
          cell1.innerHTML = element.name;
          cell2.innerHTML = arrayOfGaeste[key.seatedBy];
          cell3.innerHTML = key.tableNumber;
          cell4.innerHTML = key.typeoftableseat;
          cell5.innerHTML = key.tableform;
          cell6.innerHTML = key.seatNumber;
          cell7.innerHTML = '<form action="/delete-reserv" method="post"><input type="hidden" id="object" name="object" value="' + key + '"><input type="hidden" id="roomNumber" name="roomNumber" value="' + key.roomNumber + '"><input type="hidden" id="tableNumber" name="tableNumber" value="' + key.tableNumber + '"><input type="hidden" id="elemid" name="elemid" value="' + element._id + '"><input type="hidden" id="seatedBy" name="seatedBy" value="' + key.seatedBy + '"><input type="hidden" id="seatNumber" name="seatNumber" value="' + key.seatNumber + '"><input type="submit" value="Cancel"></form>';
        }
      }
    })
    .catch(err => {
      console.log(err);
    });
}
getDataTablesForDelete();

function getDataErweiterung () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then(async (res) => {
      const stringifiedObject = JSON.stringify(res);
      const objects = JSON.parse(stringifiedObject);
      const table = document.getElementById('data-eventErw');
      const arrayOfGaeste = [];
      for (const getguest of objects.filteredGuests) {
        arrayOfGaeste[getguest._id] = getguest.name;
      }
      for (const element of objects.filteredEvents) {
        for (const key of element.seatingPlan) {
          const row = table.insertRow();
          const cell1 = row.insertCell(0);
          const cell2 = row.insertCell(1);
          const cell3 = row.insertCell(2);
          const cell4 = row.insertCell(3);
          const cell5 = row.insertCell(4);
          const cell6 = row.insertCell(5);
          cell1.innerHTML = element.name;
          cell2.innerHTML = arrayOfGaeste[key.seatedBy];
          cell3.innerHTML = key.roomNumber;
          cell4.innerHTML = key.tableNumber;
          cell5.innerHTML = '<form action="/update-placement" method="post"><input type="hidden" id="object" name="object" value="' + key + '"><input type="hidden" id="roomNumber" name="roomNumber" value="' + key.roomNumber + '"><input type="hidden" id="tableNumber" name="tableNumber" value="' + key.tableNumber + '"><input type="hidden" id="elemid" name="elemid" value="' + element._id + '"><input type="hidden" id="seatedBy" name="seatedBy" value="' + key.seatedBy + '"><input type="hidden" id="seatNumber" name="seatNumber" value="' + key.seatNumber + '"><select name="seatorder" id="seatorder"><option value="einseitig">Einseitig</option><option value="zweiseitig">Zweiseitig</option></select><input type="submit" value="aendern"></form>';
          cell6.innerHTML = '<form action="/update-tableform" method="post"><input type="hidden" id="object" name="object" value="' + key + '"><input type="hidden" id="roomNumber" name="roomNumber" value="' + key.roomNumber + '"><input type="hidden" id="tableNumber" name="tableNumber" value="' + key.tableNumber + '"><input type="hidden" id="elemid" name="elemid" value="' + element._id + '"><input type="hidden" id="seatedBy" name="seatedBy" value="' + key.seatedBy + '"><input type="hidden" id="seatNumber" name="seatNumber" value="' + key.seatNumber + '"><select id="tableform" name="tableform"><option value="rechteckiger Tisch">rechteckig</option><option value="kreis Tisch">kreis</option><option value="quadratischer Tisch">quadratisch</option></select><input type="submit" value="aendern"></form>';
        }
      }
    })
    .catch(err => {
      console.log(err);
    });
}
getDataErweiterung();

function getEventOptions () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then((res) => {
      const stringifiedObject = JSON.stringify(res);
      const objects = JSON.parse(stringifiedObject);
      if (objects.filteredGuests.length !== 0) {
        for (const element of objects.filteredGuests) {
          if (element.status === 'eingeladen' || element.status === 'zugesagt') {
            const selectGuestOptions = document.getElementById('gie');
            const opt = document.createElement('option');
            opt.value = element._id;
            opt.innerHTML = element.name;
            if (selectGuestOptions !== null) {
              selectGuestOptions.appendChild(opt);
            }
          }
        }
      }
      const guestObject = objects.filteredGuests[0];

      const selectEventOptions = document.getElementById('guestevent');
      let count = 0;
      for (const element of objects.filteredEvents) {
        let isTrue = false;
        for (let g = 0; g < element.seatingPlan.length; g++) {
          if (String(guestObject._id) === String(element.seatingPlan[g].seatedBy)) {
            isTrue = true;
          }
        }
        if (isTrue === false) {
          const opt = document.createElement('option');
          opt.value = element._id;
          opt.innerHTML = element.name;
          if (selectEventOptions !== null) {
            selectEventOptions.appendChild(opt);
          }
          count++;
        }
      }
      if (count > 0) {
        const selectRoomOptions = document.getElementById('rooms');
        let firstevent;
        for (const element of objects.filteredEvents) {
          if (selectEventOptions !== null) {
            if (String(element._id) === String(selectEventOptions[0].value)) {
              firstevent = element;
              break;
            }
          }
        }
        if (firstevent !== undefined) {
          for (let i = 0; i < firstevent.roomNumber.length; i++) {
            const optRoom = document.createElement('option');
            optRoom.value = firstevent.roomNumber[i];
            optRoom.innerHTML = firstevent.roomNumber[i];
            selectRoomOptions.appendChild(optRoom);
          }
          const roomnumber = firstevent.roomNumber[0];
          let room;
          for (const element of objects.rooms) {
            if (element.number === roomnumber) {
              room = element;
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
          for (const element of firstevent.seatingPlan) {
            console.log(firstevent.seatingPlan[0].seatNumber);
            listOfAvailableSeats.push(element.seatNumber);
          }
          for (let i = 0; i < room.tables[0].seatsAvailable; i++) {
            let isTrue1 = false;
            for (const element of listOfAvailableSeats) {
              if (Number(element) === Number(i + 1)) {
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

  if (selectedOption) {
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
            listOfAvailableSeats.push(firstevent.seatingPlan[i].seatNumber);
          }
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
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  // listen to changes in Guest selector

  const selectedGuest = document.getElementById('gie');

  if (selectedGuest) {
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
              listOfAvailableSeats.push(firstevent.seatingPlan[i].seatNumber);
            }
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
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  // listen to changes in Room selector

  const selectedOptionRoom = document.getElementById('rooms');

  if (selectedOptionRoom) {
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
            if (Number(room.number) === Number(firstevent.seatingPlan[i].roomNumber)) {
              listOfAvailableSeats.push(firstevent.seatingPlan[i].seatNumber);
            }
          }
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
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  // listen to changes in table selector

  const selectedOptionTable = document.getElementById('seatTable');

  if (selectedOptionTable) {
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
          let roomnum;
          for (let i = 0; i < objects.rooms.length; i++) {
            for (let g = 0; g < objects.rooms[i].tables.length; g++) {
              if (Number(selectedValue) === Number(objects.rooms[i].tables[g].number)) {
                roomnum = objects.rooms[i];
                break;
              }
            }
          }
          const form = document.getElementById('event-form');
          let firstevent;
          for (let i = 0; i < objects.filteredEvents.length; i++) {
            if (String(form.elements.guestevent.value) === String(objects.filteredEvents[i]._id)) {
              firstevent = objects.filteredEvents[i];
            }
          }
          const listOfAvailableSeats = [];
          for (let i = 0; i < firstevent.seatingPlan.length; i++) {
            if (Number(roomnum.number) === Number(firstevent.seatingPlan[i].roomNumber)) {
              if (Number(selectedValue) === Number(firstevent.seatingPlan[i].tableNumber)) {
                listOfAvailableSeats.push(firstevent.seatingPlan[i].seatNumber);
              }
            }
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
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  // date tag changes

  const dateTag = document.getElementById('edate');

  if (dateTag) {
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
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
};
