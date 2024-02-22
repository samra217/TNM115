const serverUrl = "http://127.0.0.1:3000";

function saveInputs() {
  const name = document.getElementById("insert-name").value;
  const desc = document.getElementById("insert-desc").value;
  const _id = document.getElementById("insert-id").value;
  const disc = document.getElementById("insert-disc").value;
  const ref = document.getElementById("insert-ref").value;

  if (isAllAnswered(name, desc, _id, disc, ref)) {
    const json = makeArtistJsonObject(name, desc, _id, disc, ref);
    sendToServer(json);
  } else {
    const errorP = document.getElementById("error");
    errorP.innerHTML = "Error you did not submit every input";
  }
}

function makeArtistJsonObject(name, desc, _id, disc, ref) {
  const refArr = ref.split(" ");
  return {
    _id: parseInt(_id),
    discogsUrl: disc,
    name: name,
    description: desc,
    nameVariations: null,
    aliases: null,
    memberInGroups: null,
    referenceUrls: refArr,
  };
}

function isAllAnswered(name, ref, desc, _id, disc) {
  if (
    name != null &&
    ref != null &&
    desc != null &&
    _id != null &&
    disc != null
  ) {
    return true;
  }
  return false;
}

async function sendToServer(artistJson) {
  const response = await fetch(serverUrl + "/insertartist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(artistJson),
  });

  if (response.ok) {
    document.getElementById("error").innerHTML = "Insert was succesfull";
  } else document.getElementById("error").innerHTML = "Insert was unsuccesfull";
}
