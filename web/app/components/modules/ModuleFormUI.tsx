"use client";
import React, { useState } from "react";
import { FormUI, LocaleString } from "@/app/sanity-api/types/sanity.types";
import { _localizeField, _localizeText } from "@/app/sanity-api/utils";
import clsx from "clsx";

type SubjectProps = Array<{
  to?: string;
  title?: LocaleString;
  description?: LocaleString;
  _type: "subectItem";
  _key: string;
}>;

type Props = {
  input: FormUI;
};

const ModuleFormUI = ({ input }: Props) => {
  const { title, subject } = input;
  const [selectedSubject, setSelectedSubject] = useState<SubjectProps | null>(
    null,
  );
  const [data, setData] = useState({});
  const _update = (key: string, val: any) => {
    // console.log(val);
    if (key === "subject") {
      setSelectedSubject(val);
    }
    setData((pre) => ({ ...pre, [key]: val }));
  };
  const _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(selectedSubject);
    console.log(data);
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
                    // value={data["subject"] ?? ""}
                    onChange={(e) => _update("subject", e.target.value)}
                    aria-label={_localizeText("Motif de contact *")}>
                    {/* <option value=''>
                      {_localizeText("Motif de contact")}
                    </option> */}
                    {subject?.map((opt) => (
                      <option key={opt._key} value={`${opt}`}>
                        {_localizeField(opt.title)}{" "}
                        {_localizeField(opt.description)}
                      </option>
                    ))}
                  </select>
                </div>
                {fields.map((item, i) => (
                  <div
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
                  <button className='btn' type='submit'>
                    {_localizeText("send")}
                  </button>
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
