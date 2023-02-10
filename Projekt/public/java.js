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
      for (let i = 0; i < objects.filteredEvents.length; i++) {
        for (let g = 0; g < objects.filteredEvents[i].guests.length; g++) {
          const row = table.insertRow();
          const cell1 = row.insertCell(0);
          const cell2 = row.insertCell(1);
          const cell3 = row.insertCell(2);
          const cell4 = row.insertCell(3);
          cell1.innerHTML = objects.filteredEvents[i].name;
          cell2.innerHTML = objects.filteredEvents[i].guests[g].name;
          cell3.innerHTML = objects.filteredEvents[i].guests[g].status;
          cell4.innerHTML = objects.filteredEvents[i].guests[g].email;
        }
      }
    }
    );
}
getDataGuest();

function getDataTables () {
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
getDataTables();

function getEventOptions () {
  fetch('/api/dataEvent')
    .then((res) => res.json())
    .then((res) => {
      const stringifiedObject = JSON.stringify(res);
      const objects = JSON.parse(stringifiedObject);
      if (objects.filteredEvents.length !== 0) {
        for (let i = 0; i < objects.filteredEvents.length; i++) {
          const selectTableOptions = document.getElementById('guestevent');
          const opt = document.createElement('option');
          opt.value = objects.filteredEvents[i]._id;
          opt.innerHTML = objects.filteredEvents[i].name;
          selectTableOptions.appendChild(opt);
        }
        const roomnumber = objects.filteredEvents[0].roomNumber;
        let room;
        for (let i = 0; i <= objects.rooms.length; i++) {
          if (objects.rooms[i].number === roomnumber) {
            room = objects.rooms[i];
            break;
          }
        }
        const selectTableOptions = document.getElementById('seatTable');
        selectTableOptions.options.length = 0;
        for (let i = 1; i <= room.tables.length; i++) {
          const optTable = document.createElement('option');
          optTable.value = i;
          optTable.innerHTML = i;
          selectTableOptions.appendChild(optTable);
        }
        const selectRoomOptions = document.getElementById('rooms');
        const optRoom = document.createElement('option');
        selectRoomOptions.options.length = 0;
        optRoom.value = room.number;
        optRoom.innerHTML = room.number;
        selectRoomOptions.appendChild(optRoom);
      }
    }
    );
}
getEventOptions();

window.onload = function () {
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
        for (let i = 0; i < objects.filteredEvents.length; i++) {
          if (String(selectedValue) === String(objects.filteredEvents[i]._id)) {
            roomnumber = objects.filteredEvents[i].roomNumber;
            break;
          }
        }
        let room;
        for (let i = 0; i <= objects.rooms.length; i++) {
          if (objects.rooms[i].number === roomnumber) {
            room = objects.rooms[i];
            break;
          }
        }
        const selectTableOptions = document.getElementById('seatTable');
        selectTableOptions.options.length = 0;
        for (let i = 1; i <= room.tables.length; i++) {
          const optTable = document.createElement('option');
          optTable.value = i;
          optTable.innerHTML = i;
          selectTableOptions.appendChild(optTable);
        }
        const selectRoomOptions = document.getElementById('rooms');
        selectRoomOptions.options.length = 0;
        const optRoom = document.createElement('option');
        optRoom.value = room.number;
        optRoom.innerHTML = room.number;
        selectRoomOptions.appendChild(optRoom);
      }
      );
  });

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
        for (let i = 0; i <= objects.rooms.length; i++) {
          if (objects.rooms[i].number === selectedValue) {
            room = objects.rooms[i];
            break;
          }
        }
        const selectTableOptions = document.getElementById('seatTable');
        selectTableOptions.options.length = 0;
        for (let i = 1; i <= room.tables.length; i++) {
          const optTable = document.createElement('option');
          optTable.value = i;
          optTable.innerHTML = i;
          selectTableOptions.appendChild(optTable);
        }
        const selectRoomOptions = document.getElementById('rooms');
        selectRoomOptions.options.length = 0;
        const optRoom = document.createElement('option');
        optRoom.value = room.number;
        optRoom.innerHTML = room.number;
        selectRoomOptions.appendChild(optRoom);
      }
      );
  });
};
