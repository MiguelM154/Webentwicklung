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
        cell1.innerHTML = objects.filteredEvents[i].name;
        cell2.innerHTML = objects.filteredEvents[i].date;
        cell3.innerHTML = objects.filteredEvents[i].roomNumber;
      }
    }
    );
}
getData();

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
        cell3.innerHTML = objects.filteredGuests[i].email;
      }
    }
    );
}
getDataGuest();

/* function getDataTables () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then((res) => {
      const stringifiedObject = JSON.stringify(res);
      const objects = JSON.parse(stringifiedObject);
      const table = document.getElementById('data-table');
      for (let i = 0; i < objects.filteredEvents.length; i++) {
        for (let g = 0; g < objects.filteredEvents[i].guests.length; g++) {
          const row = table.insertRow();
          const cell1 = row.insertCell(0);
          const cell2 = row.insertCell(1);
          const cell3 = row.insertCell(2);
          const cell4 = row.insertCell(3);
          cell1.innerHTML = objects.filteredEvents[i].name;
          cell2.innerHTML = objects.filteredEvents[i].guests[g].name;
          cell3.innerHTML = objects.filteredEvents[i].guests[g].seatNumber.table;
          cell4.innerHTML = objects.filteredEvents[i].guests[g].seatNumber.seat;
        }
      }
    }
    );
}
getDataTables(); */

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
      if (objects.filteredEvents.length !== 0) {
        for (let i = 0; i < objects.filteredEvents.length; i++) {
          const selectTableOptions = document.getElementById('guestevent');
          const opt = document.createElement('option');
          opt.value = objects.filteredEvents[i]._id;
          opt.innerHTML = objects.filteredEvents[i].name;
          selectTableOptions.appendChild(opt);
        }
        const selectRoomOptions = document.getElementById('rooms');
        for (let i = 0; i < objects.filteredEvents[0].roomNumber.length; i++) {
          const optRoom = document.createElement('option');
          console.log(objects.filteredEvents[0].roomNumber[i] + ' ' + i);
          optRoom.value = objects.filteredEvents[0].roomNumber[i];
          optRoom.innerHTML = objects.filteredEvents[0].roomNumber[i];
          selectRoomOptions.appendChild(optRoom);
        }
        const roomnumber = objects.filteredEvents[0].roomNumber[0];
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
      }
    }
    );
}
getEventOptions();

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
        for (let i = 0; i < objects.filteredEvents.length; i++) {
          if (String(selectedValue) === String(objects.filteredEvents[i]._id)) {
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
        console.log(objects.rooms[0].name);
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
      }
      );
  });

  const selectedOptionRoom = document.getElementById('rooms');

  // listen to changes in Room selector

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
            console.log('test');
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
      }
      );
  });

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
