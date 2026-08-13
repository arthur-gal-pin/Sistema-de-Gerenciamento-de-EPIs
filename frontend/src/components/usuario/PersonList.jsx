import PersonCard from "./PersonCard";

export default function PersonList({ persons }) {
  return (
    <div>
      {persons.map((person) => (
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  );
}