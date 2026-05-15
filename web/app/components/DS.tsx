import clsx from "clsx";
import React from "react";

type Props = {};

const DS = (props: Props) => {
  const json = {
    _type: ["product", "pret", "visites", "event"],
    tag: "tag",
    title: "Titre H2",
    subtitle: "soustitre",
    infos: "Infos (date ou prix, ou lieu)",
    text: "Texte courant carte (optionnel)",
    images: [
      "https://cdn.sanity.io/images/e07ih8cz/production/96155cf7b1b32964a9ad99235b7d48dcf3709a8d-649x518.png",
      "https://cdn.sanity.io/images/e07ih8cz/production/e77ca995007b8823f70d471699a158c3400b2a65-728x480.png",
      "https://cdn.sanity.io/images/e07ih8cz/production/8a176abb15e4756f0eae88324e5d5d216d19af87-728x1109.png",
      "https://cdn.sanity.io/images/e07ih8cz/production/60fe793d5560f43252b3e61f6ddf96c8c30c062c-728x486.png",
    ],
  };
  const data = [json, json, json, json];
  return (
    <div>
      <h2 className='c-h1_5'>Cards 1a</h2>
      <div className='grid md:grid-cols-4 gap-gutter'>
        {data.map((item, i) => (
          <div
            className={clsx(
              "card card--l1a",
              item._type && `card--${item._type[i]}`,
            )}>
            <div className='card__header'>
              <div className='card__tag c-tag'>{item.tag}</div>
              <h2 className='card__title c-h2'>{item.title}</h2>
              <div className='card__subtitle c-h3'>{item.subtitle}</div>
            </div>
            <figure className='card__figure'>
              <img src={item.images[i]} alt='' />
            </figure>
            <div className='card__footer'>
              <div className='card__info c-body-xs'>{item.infos}</div>
              <div className='btns'>
                <button className='btn btn--primary'>Bouton primary</button>
                <button className='btn btn--secondary'>Bouton secondary</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2 className='c-h1_5'>Cards 1b</h2>
      <div className='grid md:grid-cols-4 gap-gutter'>
        {data.map((item, i) => (
          <div
            className={clsx(
              "card card--l1b",
              item._type && `card--${item._type[i]}`,
            )}>
            <div className='card__header'>
              <div className='card__tag c-tag'>{item.tag}</div>
              <h2 className='card__title c-h2'>{item.title}</h2>
              <div className='card__subtitle c-h3'>{item.subtitle}</div>
            </div>
            <figure className='card__figure'>
              <img src={item.images[1]} alt='' />
              <img src={item.images[3]} alt='' />
            </figure>
            <div className='card__footer'>
              <div className='card__info c-body-xs'>{item.infos}</div>
              <div className='btns'>
                <button className='btn btn--primary'>Bouton primary</button>
                <button className='btn btn--secondary'>Bouton secondary</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2 className='c-h1_5'>Cards 1c</h2>
      <div className='grid md:grid-cols-4 gap-gutter'>
        {data.map((item, i) => (
          <div
            className={clsx(
              "card card--l1c",
              item._type && `card--${item._type[i]}`,
            )}>
            <div className='card__header'>
              <div className='card__tag c-tag'>{item.tag}</div>
              <h2 className='card__title c-h2'>{item.title}</h2>
              <div className='card__subtitle c-h3'>{item.subtitle}</div>
            </div>
            <figure className='card__figure'>
              <img src={item.images[i]} alt='' />
            </figure>
            <div className='card__footer'>
              <div className='card__info c-body-xs'>{item.infos}</div>
              <div className='btns'>
                <button className='btn btn--primary'>Bouton primary</button>
                <button className='btn btn--secondary'>Bouton secondary</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className='c-h1_5'>Cards 2a</h2>
      <div className='grid md:grid-cols-2 gap-gutter'>
        {data.map((item, i) => (
          <div
            className={clsx(
              "card card--l2a",
              item._type && `card--${item._type[i]}`,
            )}>
            <div className='card__header'>
              <div className='card__tag c-tag'>{item.tag}</div>
              <h2 className='card__title c-h2'>{item.title}</h2>
              <div className='card__subtitle c-h3'>{item.subtitle}</div>
              <div className='card__text c-body-sm'>{item.text}</div>
            </div>
            <figure className='card__figure'>
              <img src={item.images[i]} alt='' />
            </figure>
            <div className='card__footer'>
              <div className='card__info c-body-xs'>{item.infos}</div>
              <div className='btns'>
                <button className='btn btn--primary'>Bouton primary</button>
                <button className='btn btn--secondary'>Bouton secondary</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className='c-h1_5'>Cards 3</h2>
      <div className='grid md:grid-cols-2 gap-gutter items-start'>
        {data.map((item, i) => (
          <div
            className={clsx(
              "card card--l3",
              item._type && `card--${item._type[i]}`,
            )}>
            <div className='card__header__figure'>
              <div className='card__header'>
                <div className='top'>
                  <div className='card__tag c-tag'>{item.tag}</div>
                  <h2 className='card__title c-h2'>{item.title}</h2>
                  <div className='card__subtitle c-h3'>{item.subtitle}</div>
                  <div className='card__text c-body-sm'>{item.text}</div>
                </div>

                <div className='bottom'>
                  <div className='card__info c-body-xs'>{item.infos}</div>
                </div>
              </div>
              <div className='card__figure'>
                <figure className=''>
                  <img src={item.images[i]} alt='' />
                </figure>
              </div>
            </div>

            <div className='card__footer'>
              <div className='btns'>
                <button className='btn btn--primary'>Bouton primary</button>
                <button className='btn btn--secondary'>Bouton secondary</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className='c-h1_5'>Cards 4</h2>
      <div className='grid md:grid-cols-1 gap-gutter items-start'>
        {data.map((item, i) => (
          <div
            className={clsx(
              "card card--l4",
              item._type && `card--${item._type[i]}`,
            )}>
            <div className='card__header__footer'>
              <div className='card__header'>
                <div className='card__tag c-tag'>{item.tag}</div>
                <h2 className='card__title c-h2'>{item.title}</h2>
                <div className='card__subtitle c-h3'>{item.subtitle}</div>
                <div className='card__text c-body-sm'>{item.text}</div>
              </div>

              <div className='card__footer'>
                <div className='card__info c-body-xs'>{item.infos}</div>

                <div className='btns'>
                  <button className='btn btn--primary'>Bouton primary</button>
                  <button className='btn btn--secondary'>
                    Bouton secondary
                  </button>
                </div>
              </div>
            </div>

            <div className='card__figure'>
              <figure className=''>
                <img src={item.images[i]} alt='' />
              </figure>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DS;
