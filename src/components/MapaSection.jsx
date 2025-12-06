import React from "react";
import MapaBrasil from "./MapaBrasil";
import "../css/mapabrasil.css";

function MapaSection({ onSelectRegiao, selectedRegiao }) {
  // Textos explicativos por região
  const regioesInfo = {
    norte: {
      titulo: "Região Norte",
      texto: `A Região Norte do Brasil é um tesouro de biodiversidade e recursos naturais, com sua agricultura profundamente integrada à vastidão da Floresta Amazônica. Caracteriza-se pela produção extrativista sustentável e pelo cultivo de culturas adaptadas ao clima equatorial. Destacam-se o <b><mark>açaí</mark></b>, fundamental para a economia local e dieta regional, a <b><mark>castanha-do-pará</mark></b>, valorizada por seu alto teor nutritivo, e a <b><mark>mandioca</mark></b>, base da alimentação. Além disso, a região é um polo para <b><mark>frutas tropicais exóticas</mark></b> como cupuaçu, bacuri e taperebá, que impulsionam a agroindústria e o turismo gastronômico. A pesca e a pecuária extensiva também complementam a matriz produtiva, fazendo do Norte um exemplo de coexistência entre floresta e produção agrícola.`,
    },
    nordeste: {
      titulo: "Região Nordeste",
      texto: `O Nordeste é um polo vibrante da agricultura brasileira, conhecido por sua diversidade de climas e solos, que permitem uma vasta gama de cultivos. A <b><mark>produção de frutas</mark></b> é um dos seus maiores destaques, com o <b><mark>Vale do São Francisco</mark></b> sendo um grande exportador de uvas, mangas e melões de alta qualidade. A <b><mark>cana-de-açúcar</mark></b> possui uma longa história na região, ainda sendo uma cultura predominante, assim como o <b><mark>algodão</mark></b>, que impulsiona a indústria têxtil. O litoral e o semiárido também contribuem com culturas como o coco, caju, feijão e milho. A culinária local é ricamente marcada por sabores fortes e tradições que nascem dessa produção agrícola, com pratos à base de milho, mandioca e frutos do mar, refletindo a riqueza cultural e produtiva da região.`,
    },
    'centro-oeste': {
      titulo: "Região Centro-Oeste",
      texto: `O Centro-Oeste é o coração do agronegócio brasileiro, responsável por grande parte da produção de <b><mark>grãos</mark></b> e carnes do país. É uma região de vastas planícies e <b><mark>tecnologia de ponta no campo</mark></b>. A <b><mark>soja e o milho</mark></b> dominam as lavouras, sendo cultivados em larga escala e com alta produtividade, abastecendo tanto o mercado interno quanto o externo. A <b><mark>pecuária bovina</mark></b>, tanto de corte quanto de leite, é igualmente expressiva, com grandes rebanhos que se beneficiam das extensas pastagens. A região também se destaca na produção de algodão e girassol. O investimento em pesquisa e desenvolvimento, como o uso de biotecnologia e agricultura de precisão, faz do Centro-Oeste uma das regiões mais tecnológicas e eficientes da agroindústria global, impulsionando a economia nacional.`,
    },
    sudeste: {
      titulo: "Região Sudeste",
      texto: `O Sudeste, o motor econômico do Brasil, também possui uma agricultura diversificada e de grande importância. A cultura do <b><mark>café</mark></b>, com suas tradições centenárias, ainda floresce em estados como Minas Gerais e São Paulo, produzindo alguns dos cafés mais apreciados no mundo. A <b><mark>cana-de-açúcar</mark></b> é outro pilar, com São Paulo sendo o maior produtor nacional, vital para a produção de açúcar e etanol. A <b><mark>fruticultura</mark></b>, especialmente a laranja, é um setor forte, com grande exportação de suco concentrado. Além disso, a região investe em horticultura, flores e produção de leite, combinando a tradição agrícola com alta tecnologia e inovação. A proximidade com grandes centros consumidores e uma infraestrutura logística desenvolvida contribuem para a eficiência e competitividade da agricultura sudeste.`,
    },
    sul: {
      titulo: "Região Sul",
      texto: `A Região Sul do Brasil, com suas paisagens de serra e litoral e um clima temperado, é um polo agrícola de grande valor, com forte tradição familiar e uso de <b><mark>tecnologias avançadas</mark></b>. É líder nacional na produção de <b><mark>grãos</mark></b> como arroz (especialmente no Rio Grande do Sul), milho e trigo, que se adaptam bem às condições climáticas. A <b><mark>viticultura</mark></b>, com a produção de vinhos finos na Serra Gaúcha, é um setor de excelência e reconhecimento internacional. A produção de <b><mark>leite e seus derivados</mark></b>, assim como a avicultura e suinocultura, são atividades robustas que abastecem o país e o mercado externo. Frutas como maçã, pêssego e caqui também prosperam na região, que se destaca pela organização dos produtores e pela agregação de valor aos seus produtos, combinando a herança cultural dos imigrantes com a modernidade do agronegócio.`,
    },
  };

  const info = regioesInfo[selectedRegiao] || null;

  return (
    <div className="hero5 text-center text-white">
      <div className="container d-flex flex-column align-items-start px-5">
        <h2 className="video-title mb-4">
          <i className="bi bi-pin-angle-fill"></i> Filtrar por estado
        </h2>

        <div className="mapa-section d-flex justify-content-center align-items-stretch gap-5">
          <div className="mapa-container">
            <MapaBrasil onSelectRegiao={onSelectRegiao} selectedRegiao={selectedRegiao} />
          </div>

          <div className="texto-regiao text-start d-flex flex-column justify-content-center">
            {info ? (
              <div className="info-box">
                <h3 className="fw-bold mb-3">{info.titulo}</h3>
                {/* Usando dangerouslySetInnerHTML para renderizar o HTML */}
                <p dangerouslySetInnerHTML={{ __html: info.texto }}></p>
              </div>
            ) : (
              <div className="info-box">
                <p className="text-muted">Selecione um estado no mapa para saber mais sobre sua região e suas riquezas naturais.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapaSection;