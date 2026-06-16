const Header = ({ course }) => (
  <h2>{course}</h2>
)

const Part = ({ name, count }) => (
  <p>{name} {count}</p>
)

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} name={part.name} count={part.exercises} />
      ))}
    </div>
  )
}

const Total = ({ parts }) => {
  const total = parts.reduce((accum, curr) => (accum + curr.exercises), 0)
  return (
    <strong>total of {total} exercise{total === 1 ? "" : "s"}</strong>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course