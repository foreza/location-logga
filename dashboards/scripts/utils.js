// Utility function to fetch
let async_getDataFromBucket = async (dataURI) => {
  try {
    const response = await fetch(dataURI);
    const data = await response.json();
    return data;
  } catch (e) {
    console.error("Error fetching from bucket: ", e)
    return undefined
  }

}

// Utility function to help
function adjustTimeForUTC(originalUTCHr) {
  var utcDiff = -7;
  var tVal = originalUTCHr + utcDiff;
  return tVal < 0 ? tVal + 24 : tVal;
}


function get12HrSuffixedString(original24HrVal) {
  let retString = "";

  if (typeof(original24HrVal) != "number") {
    original24HrVal = parseInt(original24HrVal);
  }

  // Short terminate
  if (original24HrVal >= 24 || original24HrVal < 0) {
    return "Invalid time";
  }

  // Handle midnight and noon
  if (original24HrVal == 12) {
    return "12PM"
  } else if (original24HrVal == 0) {
    return "12AM"
  }

  // All other cases
  if (original24HrVal < 12) {
    retString = original24HrVal + "AM";
  } else {
    let adjustedVal = (original24HrVal - 12)
    retString = adjustedVal + "PM";
  }

  // console.log(`${original24HrVal} -> ${retString}`);
  return retString;
}


let util_updateAllEleForClassNameToText = (documentRef, eleClassName, textValue) => {
  let tArr = Array.from(documentRef.getElementsByClassName(eleClassName));
  tArr.forEach(e => e.innerHTML = textValue);
}


// Tests
// get12HrSuffixedString(-1);
// get12HrSuffixedString(0);
// get12HrSuffixedString(10);
// get12HrSuffixedString(12);
// get12HrSuffixedString(15);
// get12HrSuffixedString(24);
// get12HrSuffixedString(25);