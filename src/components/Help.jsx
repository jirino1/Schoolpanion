import React from "react";
//Hilfe-Seite
const Help = () => {
  return (
    <div
      style={{ paddingBottom: "60px", paddingTop: "20px" }}
      className="ui container"
    >
      <h1
        style={{
          textAlign: "center"
        }}
      >
        So benutzt man Schoolpanion
      </h1>
      <h3>Was ist Schoolpanion?</h3>
      <p>
        Die App die jeder braucht! Ne Quatsch, aber sie bietet jede Menge an
        tollen Features um dir die Organisation von deinem Schulleben zu
        erleichtern. Du kannst Lernpläne für die Klausuren verwalten sowie
        Hausaufgaben und deinen Stundenplan eintragen. Auf der Hauptseite werden
        dir bei allem Chaos kurz und kompakt die{" "}
        <b>{"5 nächsten anstehenden "}</b>
        Aufgaben von den Lernplänen und den Hausaufgaben angezeigt.
        <br />
        Anmerkung vom Entwickler: So stolz ich auch auf meine App bin: Ich bin
        weiterhin offen für Verbesserungsvorschäge. Kontaktier mich per E-Mail
        unter schoolpanion@gmail.com !
        <br />
      </p>
      <h3>Klausuren</h3>
      <p>
        Die nächsten Klausuren bahnen sich an und du willst organisieren, wann
        du was lernen musst? Dann erstelle eine Klausur, indem du auf
        <label style={{ color: "blue" }}>{" Klausuren"}</label> und dann auf
        Neue Klausur gehst. Pflichtfelder sind das Fach, und der Klausurtermin.
        Über den "Aufgaben hinzufügen"-Knopf kannst du Aufgaben hinzufügen,
        welchen du einen Titel, einen Tag, bis wann sie erledigt sein soll,
        sowie optional eine Beschreibung. Beachte dabei, dass du nur die Fächer
        auswählen kannst, die auch in deinem Stundenplan stehen. Stelle also
        sicher, dass du deinen Stundenplan immer eingetragen hast oder zumindest
        deine Klausurfächer :)
        <br />
        Wenn du einen Fehler baust, kein Problem! Du kannst sie jederzeit
        bearbeiten, indem du {" den "} <i className="edit icon" />
        Knopf betätigst, oder löschen, indem du den{" "}
        <i className="trash inline icon" />
        Knopf betätigst.
        <br />
        <b>
          Alle Klausuren und deren Aufgaben werden 14 Tage nach Ablauf ihrer
          Frist automatisch gelöscht.
        </b>
      </p>
      <h3>Hausaufgaben</h3>
      <p>
        Zum idealen Schulbegleiter gehört natürlich auch ein Hausaufgabenheft.
        Unter <label style={{ color: "blue" }}>Hausaufgaben</label> kannst du
        Hausaufgaben erstellen, bearbeiten und löschen nach Herzenslust! Es
        funktioniert genauso wie bei den Klausuren - schnell und einfach (wenn
        nicht: schoolpanion@gmail.com ;) )!
        <br />
        <b>
          Auch die Hausaufgaben werden 14 Tage nach Ablauf ihrer Frist
          automatisch gelöscht.
        </b>
      </p>
      <h3>Stundenplan</h3>
      <p>
        Den Stundenplan kannst du unter{" "}
        <label style={{ color: "blue" }}>Stundenplan</label> verwalten. Durch
        einen Doppelklick auf das gewünschte Feld kannst du es bearbeiten. Die
        Zeiten, in denen die einzelnen Stunden stattfinden, kannst du ebenfalls
        durch einen Doppelklick auf die Stunden hinzufügen.
        <br />
        <b>Auf der Hauptseite kannst du den Stundenplan NICHT BEARBEITEN!</b>
        (Passierte mir beim entwickeln oft)
        <br /> Wenn du eine Hausaufgabe zu einem Tag erstellst, an dem du das
        Fach der Hausaufgabe hast, erkennt das System dies automatisch. Somit
        werden auf dem Stundenplan Aufgaben, welche diese Woche für ein Fach
        anstehen, angezeigt. Halte einfach den Mauszeiger über die orange
        hinterlegten Felder.
      </p>
      <h3>Die App ist abgestürzt -.-</h3>
      <p>
        Das kann natürlich vorkommen - Bin ja auch nur ein Mensch. Wenn das
        passiert, gibt es drei Lösungen:
      </p>
      <ol>
        <li>Lad die Seite noch einmal neu.</li>
        <li>
          Versuche, die Hausaufgabe oder die Klausur, die den Fehler verursacht,
          zu löschen und nochmal neu zu erstellen.
        </li>
        <li>
          LETZTE OPTION: App zurücksetzen, indem du auf den roten{" "}
          <i className="red bug icon" />
          -Knopf gehst oder indem du https://schoolpanion.herokuapp.com/reset
          aufrufst, bestätigst und danach die Seite neu lädst.
        </li>
      </ol>
      <br />
      <b>
        Falls der erste Schritt nicht geklappt hat, würde es mir wirklich
        helfen, wenn du mir einen Screenshot (Windows-Taste+druck) von der
        Fehlermeldung machst (falls vorhanden) und mir per Mail zusammen mit
        einer kurzen Beschreibung von dem Fehler schicken würdest. Ich werde
        versuchen, den Fehler zu beheben.
      </b>
    </div>
  );
};
export default Help;
