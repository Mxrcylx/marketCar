'use client';
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import './marketCar.css';

interface ICurso {
  id: number;
  titulo: string;
  preco: number;
}

interface IShoppingItem {
  produto: ICurso;
  quantidade: number;
}

const cursos: ICurso[] = [
  { id: 1, titulo: 'Informática Básica', preco: 520.00 },
  { id: 2, titulo: 'Eletricista Industrial', preco: 900.00 },
  { id: 3, titulo: 'Mecânico de Motociclistas', preco: 720.00 },
  { id: 4, titulo: 'Mecânico Automotivo', preco: 850.00 },
];

const formatarPreco = (preco: number): string => preco.toFixed(2);

const MarketCarPages = () => {
  const [shoppingCurso, setShoppingCurso] = useState<IShoppingItem[]>([]);

  const handleAddCurso = (id: number) => {
    const curso = cursos.find((curso) => curso.id === id);
    const cursoExisteShopping = shoppingCurso.find(item => item.produto.id === id);

    if (cursoExisteShopping) {
      const newShoppingCurso: IShoppingItem[] = shoppingCurso.map(item => {
        if (item.produto.id === id) {
          return { ...item, quantidade: item.quantidade + 1 };
        }
        return item;
      });
      setShoppingCurso(newShoppingCurso);
      return;
    }

    const carItem: IShoppingItem = {
      produto: curso!,
      quantidade: 1,
    };
    const newShoppingCurso: IShoppingItem[] = [...shoppingCurso, carItem];
    setShoppingCurso(newShoppingCurso);
  };

  const handleRemoveCurso = (id: number) => {
    const existeCursoShopping = shoppingCurso.find((item) => item.produto.id === id);

    if (existeCursoShopping!.quantidade > 1) {
      const newShoppingCurso: IShoppingItem[] = shoppingCurso.map(item => {
        if (item.produto.id === id) {
          return { ...item, quantidade: item.quantidade - 1 };
        }
        return item;
      });
      setShoppingCurso(newShoppingCurso);
      return;
    }

    const newShoppingCurso: IShoppingItem[] = shoppingCurso.filter(item => item.produto.id !== id);
    setShoppingCurso(newShoppingCurso);
  };

  const totalCurso = shoppingCurso.reduce((total, item) => {
    return total + (item.produto.preco * item.quantidade);
  }, 0);

  const handlePrintPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    // Título
    doc.setFontSize(18);
    doc.text("Carrinho de Compras", 10, y);
    y += 10;

    // Conteúdo do Carrinho
    doc.setFontSize(12);
    shoppingCurso.forEach(item => {
      doc.text(`Curso: ${item.produto.titulo}`, 10, y);
      doc.text(`Preço: R$ ${formatarPreco(item.produto.preco)}`, 10, y + 10);
      doc.text(`Quantidade: ${item.quantidade}`, 10, y + 20);
      doc.text(`Total: R$ ${formatarPreco(item.produto.preco * item.quantidade)}`, 10, y + 30);
      y += 40; // Espaço entre os itens
    });

    // Total geral
    doc.text(`Total a comprar: R$ ${formatarPreco(totalCurso)}`, 10, y + 10);

    // Salvar o PDF
    doc.save("carrinho_de_compras.pdf");
  };

  return (
    <div className="market-container">
      <div className="courses-section">
        <h1>Cursos SENAI</h1>
        <ul className="courses-list">
          {cursos.map(curso => (
            <li key={curso.id} className="course-item">
              <div className="course-details">
                <p>{curso.titulo}</p>
                <p>R$ {formatarPreco(curso.preco)}</p>
              </div>
              <button onClick={() => handleAddCurso(curso.id)}>Adicionar</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="cart-section">
        <h1>Carrinho de Compras (R$ {formatarPreco(totalCurso)})</h1>
        <ul className="cart-list">
          {shoppingCurso.map(item => (
            <li key={item.produto.id} className="cart-item">
              <div className="cart-details">
                <p>Título: {item.produto.titulo}</p>
                <p>Preço: R$ {formatarPreco(item.produto.preco)}</p>
                <p>Quantidade: {item.quantidade}</p>
                <p>Total: R$ {formatarPreco(item.produto.preco * item.quantidade)}</p>
              </div>
              <button onClick={() => handleRemoveCurso(item.produto.id)}>Remover</button>
            </li>
          ))}
        </ul>
        {shoppingCurso.length > 0 && (
          <button onClick={handlePrintPDF} className="print-button">Baixar PDF</button>
        )}
      </div>
    </div>
  );
};

export default MarketCarPages;
