const currentTimeInput = document.getElementById('currentTime');
const startTimeSendInput = document.getElementById('startTimeSend');
const endTimeSendInput = document.getElementById('endTimeSend');
const intervalSendInput = document.getElementById('intervalSend');
const travelTimeInput = document.getElementById('travelTime');
const btn = document.querySelector('button');
const today = new Date();

//Функция создания всех интервалов
const createIntervals = (start = 0, end = 0, interval = 0) => {
  const intervals = [];

  if (start > end) {
    end = end + 1440;
  }

  intervals.push(start + interval);

  do {
    intervals.push(intervals[intervals.length - 1] + interval);
  } while (intervals[intervals.length - 1] < end);

  return intervals;
};

//Валидация
const validateHHMM = (str) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(str);
const validateMM = (str) => /^[0-5][0-9]$/.test(str);

const convertHHMMToMM = (str) => {
  const HHMM = str.split(':');

  if (HHMM[0] === '00') {
    HHMM[0] = '24';
  }

  return parseInt(HHMM[0]) * 60 + parseInt(HHMM[1]);
};

const getExitTime = () => {
  const intervalSend =
    intervalSendInput.value.length === 1
      ? '0' + intervalSendInput.value
      : intervalSendInput.value;

  const travelTime =
    travelTimeInput.value.length === 1
      ? '0' + travelTimeInput.value
      : travelTimeInput.value;

  if (!validateHHMM(currentTimeInput.value)) {
    alert('Введите корректное текущее время');
    throw new Error('Incorrect startTimeSend or endTimeSend');
  }

  if (
    !validateHHMM(startTimeSendInput.value) ||
    !validateHHMM(endTimeSendInput.value)
  ) {
    alert('Введите корректные первую и последнюю отправку');
    throw new Error('Incorrect startTimeSend or endTimeSend');
  }

  if (!validateMM(intervalSend)) {
    alert('Введите корректный интервал отправки');
    throw new Error('Incorrect intervalSend');
  }

  if (!validateMM(travelTime)) {
    alert('Введите корректное время до остановки');
    throw new Error('Incorrect travelTime');
  }

  const currentTime = convertHHMMToMM(currentTimeInput.value);
  const startMinutesSend = convertHHMMToMM(startTimeSendInput.value);
  const endMinutesSend = convertHHMMToMM(endTimeSendInput.value);

  const intervalsSend = createIntervals(
    startMinutesSend,
    endMinutesSend,
    parseInt(intervalSend)
  );

  const currentMinutes = currentTime + parseInt(travelTime);

  const correctIntervalInd = intervalsSend.findIndex(
    (interval) => interval > currentMinutes
  );

  const howMuchTravelLabel = document.getElementById('howMuchTravel');

  if (correctIntervalInd !== -1) {
    const result = intervalsSend[correctIntervalInd] - currentMinutes;

    howMuchTravelLabel.innerHTML = `Нужно выйти через ${result} минут`;
  } else {
    const result =
      intervalsSend[0] -
      parseInt(intervalSend) -
      parseInt(travelTime) +
      currentMinutes;

    howMuchTravelLabel.innerHTML = `Нужно выйти через ${result} минут`;
  }
};

startTimeSendInput.value = '06:00';
endTimeSendInput.value = '00:00';
intervalSendInput.value = '15';
travelTimeInput.value = '05';
currentTimeInput.value = `${today.getHours()}:${today.getMinutes()}`;
btn.addEventListener('click', getExitTime);

getExitTime();
