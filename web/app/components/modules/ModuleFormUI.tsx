"use client";
import React, { useState } from "react";
import { FormUI, LocaleString } from "@/app/sanity-api/types/sanity.types";
import { _localizeField, _localizeText } from "@/app/sanity-api/utils";
import clsx from "clsx";

type Subject = {
  to?: string;
  title?: LocaleString;
  description?: LocaleString;
  _type: "subectItem";
  _key: string;
};

type Props = {
  input: FormUI;
};

const ModuleFormUI = ({ input }: Props) => {
  const { title, subject } = input;
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(
    subject?.[0] ?? null,
  );
  const [data, setData] = useState({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const selectedSubjectTitle = _localizeField(selectedSubject?.title);
  const _update = (key: string, val: any) => {
    if (key === "subject") {
      setSelectedSubject(subject?.find((opt) => opt._key === val) ?? null);
      return;
    }
    setData((pre) => ({ ...pre, [key]: val }));
  };
  const _onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    console.log(selectedSubjectTitle);
    console.log(data);
    try {
      const res = await fetch("/api/contact-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedSubject?.to,
          subject: selectedSubjectTitle,
          data,
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    }
  };
  const fields = [
    {
      name: "first_name",
      label: _localizeText("first_name"),
      type: "text",
      required: true,
    },
    {
      name: "last_name",
      label: _localizeText("last_name"),
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: _localizeText("email"),
      type: "email",
      required: true,
    },
    {
      name: "organisation",
      label: _localizeText("organiation"),
      type: "text",
      required: false,
    },
    {
      name: "telephone",
      label: _localizeText("telephone"),
      type: "tel",
      required: false,
    },
    {
      name: "message",
      label: _localizeText("message"),
      type: "textarea",
      required: true,
    },
  ];
  return (
    <section className='module module--form-ui'>
      <div className='container-fluid'>
        <div className='module__inner'>
          {/* {title && (
            <h2 className='module__title c-h1_5'>{_localizeField(title)}</h2>
          )} */}
          <div className='grid md:grid-cols-12 gap-gutter'>
            <div className='md:col-span-2'></div>
            <div className='md:col-span-8'>
              <form action='' onSubmit={_onSubmit}>
                <div className='form-row'>
                  <label>{_localizeText("Motif de contact *")}</label>
                  <select
                    className='ui-filters ui-filters__select'
                    value={selectedSubject?._key ?? ""}
                    onChange={(e) => _update("subject", e.target.value)}
                    aria-label={_localizeText("Motif de contact *")}>
                    {subject?.map((opt, i) => (
                      <option key={opt._key + "--" + i} value={opt._key}>
                        {_localizeField(opt.title)}{" "}
                        {_localizeField(opt.description)}
                      </option>
                    ))}
                  </select>
                </div>
                {fields.map((item, i) => (
                  <div
                    key={i}
                    className={clsx(
                      "form-row",
                      item.type !== "textarea" && "form-row--half",
                    )}>
                    <label>
                      <span>{item.label}</span>
                      <span> </span>
                      {item.required && "*"}
                      {!item.required && (
                        <span className='pr-0.5'>
                          ({_localizeText("optional")})
                        </span>
                      )}
                    </label>
                    {item.type !== "textarea" ? (
                      <input
                        name={item.name}
                        type={item.type}
                        onChange={(e) => _update(item.name, e.target.value)}
                        // placeholder={item.label}
                      />
                    ) : (
                      <textarea
                        name={item.name}
                        onChange={(e) => _update(item.name, e.target.value)}
                        // placeholder={item.label}
                      ></textarea>
                    )}
                  </div>
                ))}
                <div className='form-row'>
                  {status === "idle" ? (
                    <button className='btn' type='submit'>
                      {_localizeText("send")}
                    </button>
                  ) : (
                    <p
                      className={clsx(
                        "form-row__message",
                        status === "error" && "form-row__message--error",
                      )}>
                      {status === "sending" && _localizeText("loading")}
                      {status === "sent" && _localizeText("success")}
                      {status === "error" && _localizeText("error")}
                    </p>
                  )}
                </div>
              </form>
            </div>
            <div className='md:col-span-2'></div>
          </div>
          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </div>
      </div>
    </section>
  );
};

export default ModuleFormUI;
