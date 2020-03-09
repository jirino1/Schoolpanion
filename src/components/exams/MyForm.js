import React from "react";
import { Form, Field, FieldArray } from "formik";

const MyForm = props => {
  return (
    //handlen von Inputs der Create-/Editforms
    <Form>
      <div>
        <div
          style={{
            paddingTop: "0.5px",
            backgroundColor: "white"
          }}
          className="ui labeled input"
        >
          <label
            className={
              props.errors.subject && props.touched.subject
                ? "ui red label"
                : "ui label"
            }
          >
            Fach:{" "}
          </label>
          <select
            className={
              props.errors.subject && props.touched.subject
                ? "ui error search dropdown"
                : "ui search dropdown"
            }
            style={{
              borderTopRightRadius: "5px",
              borderBottomRightRadius: "5px",
              border: "none"
            }}
            name="subject"
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            value={props.values.subject || ""}
          >
            <option
              style={{ color: "light grey" }}
              defaultValue
              hidden
              key={""}
            >
              Fach...
            </option>
            ;
            {props.table.subjects.map(subject => {
              return <option key={subject}>{subject}</option>;
            })}
          </select>
        </div>
        {props.errors.subject && props.touched.subject ? (
          <div style={{ color: "red" }}>{props.errors.subject}</div>
        ) : null}
      </div>

      <p />
      <div>
        <div
          style={{
            paddingLeft: "0.6px",
            paddingTop: "0.6px"
          }}
          className={
            props.errors.date && props.touched.date
              ? "ui labeled error input"
              : "ui labeled input"
          }
        >
          <label
            className={
              props.errors.date && props.touched.date
                ? "ui red label"
                : "ui label"
            }
          >
            Datum:{" "}
          </label>
          <input
            type="date"
            name="date"
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            value={props.values.date || ""}
          />
        </div>
        {props.errors.date && props.touched.date ? (
          <div style={{ color: "red" }}>{props.errors.date}</div>
        ) : (
          <></>
        )}
      </div>

      <p />
      <h3 className="ui header">Aufgaben hinzufügen</h3>
      <FieldArray name="tasks">
        {arrayHelpers => (
          <div>
            {props.values.tasks && props.values.tasks.length > 0 ? (
              <div>
                {props.values.tasks.map((task, index) => {
                  let dateError = false;
                  let titleError = false;
                  if (
                    props.errors &&
                    props.errors.tasks &&
                    props.errors.tasks[index] &&
                    props.errors.tasks[index].title &&
                    props.touched.tasks &&
                    props.touched.tasks[index] &&
                    props.touched.tasks[index].title
                  ) {
                    titleError = true;
                  }
                  if (
                    props.errors &&
                    props.errors.tasks &&
                    props.errors.tasks[index] &&
                    props.errors.tasks[index].date &&
                    props.touched.tasks &&
                    props.touched.tasks[index] &&
                    props.touched.tasks[index].date
                  ) {
                    dateError = true;
                  }
                  return (
                    <div key={index}>
                      <div className="ui horizontal divider header">
                        <h4
                          style={{
                            display: "flex"
                          }}
                        >
                          <div
                            style={{
                              alignSelf: "center",
                              paddingRight: "5px"
                            }}
                            className="left floated content"
                          >
                            {"Aufgabe " + (index + 1)}
                          </div>
                          <span
                            className="ui right floated small icon button"
                            type="button"
                            style={{
                              float: "right",
                              padding: "0.5em"
                            }}
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            <i className="trash icon"></i>
                          </span>
                        </h4>
                      </div>

                      <div
                        style={{ display: "flex", marginBottom: "5px" }}
                        key={index}
                      >
                        <div>
                          <div
                            style={{
                              paddingLeft: "0.6px"
                            }}
                            className={
                              titleError
                                ? "ui labeled error input"
                                : "ui labeled input"
                            }
                          >
                            <label
                              className={
                                titleError ? "ui light red label" : "ui label"
                              }
                            >
                              Titel:{" "}
                            </label>
                            <Field
                              name={`tasks[${index}].title]`}
                              value={task.title || ""}
                            />
                          </div>
                          {titleError ? (
                            <div style={{ color: "red" }}>
                              {props.errors.tasks[index].title}
                            </div>
                          ) : null}
                        </div>
                        <div>
                          <div
                            style={{
                              marginLeft: "4.9px"
                            }}
                            className={
                              dateError
                                ? "ui labeled error input"
                                : "ui labeled input"
                            }
                          >
                            <label
                              className={
                                dateError ? "ui light red label" : "ui label"
                              }
                            >
                              Datum:{" "}
                            </label>
                            <Field
                              name={`tasks[${index}].date`}
                              type="date"
                              value={task.date || ""}
                            />
                          </div>
                          {dateError ? (
                            <div style={{ color: "red" }}>
                              {props.errors.tasks[index].date}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <textarea
                        name={`tasks[${index}].description]`}
                        placeholder="Beschreibung (optional)"
                        value={task.description || ""}
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        className="ui textarea"
                      ></textarea>

                      <br />
                    </div>
                  );
                })}
                <p />
                <div>
                  <button
                    className="ui button"
                    type="button"
                    onClick={() => arrayHelpers.push({ title: "", date: "" })}
                  >
                    Aufgaben hinzufügen
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="ui button"
                type="button"
                onClick={() => arrayHelpers.push({ title: "", date: "" })}
              >
                Aufgaben hinzufügen
              </button>
            )}
            <div>
              <p />
              <button className="ui button" type="submit">
                Bestätigen
              </button>
            </div>
          </div>
        )}
      </FieldArray>
    </Form>
  );
};
export default MyForm;
