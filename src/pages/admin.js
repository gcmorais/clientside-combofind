import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { jwtDecode } from "jwt-decode";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function Admin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [color, setColor] = useState("");
  const [budget, setBudget] = useState("");
  const [id, setId] = useState("");
  const [dbdata, setDbdata] = useState([]);
  const [modalstatus, setModalstatus] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.sub);
    } else {
      router.push("/");
    }
  }, [router]);

  const handleNavigation = () => {
    router.push("/");
  };

  const handleFinishSession = () => {
    localStorage.removeItem("jwtToken");
    router.push("/");
  };

  // Collections Submit's

  const handleCreateCollectionSubmit = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      alert("Você precisa estar logado para criar uma coleção!");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("https://localhost:7233/api/Collection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          color: color,
          budget: budget,
        }),
      });

      if (response.ok) {
        alert("Collection criada com sucesso!");
        setColor("");
        setBudget("");
      } else {
        console.error("Erro ao criar collection:", response.statusText);
        alert("Erro ao criar collection!");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao criar collection!");
    }
  };

  const handleGetCollectionSubmit = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      alert("Você precisa estar logado para buscar uma coleção!");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("https://localhost:7233/api/Collection", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDbdata(data);
        setModalstatus(true);

      } else {
        console.error("Erro ao obter collection:", response.statusText);
        alert("Erro ao obter collection!");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao obter collection!");
    }
  };

  const handleDeleteCollectionSubmit = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      alert("Você precisa estar logado para deletar uma coleção!");
      router.push("/login");
      return;
    }

    if (!id) {
      alert("Nenhuma coleção selecionada para deletar!");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7233/api/Collection/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Collection deletada com sucesso.");
        alert("Coleção deletada com sucesso!");
        setId("");
      } else {
        console.error("Erro ao deletar collection:", response.statusText);
        alert("Erro ao deletar coleção!");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao deletar coleção!");
    }
  };

  const handleUpdateCollectionSubmit = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      alert("Você precisa estar logado para atualizar uma coleção!");
      router.push("/login");
      return;
    }

    if (!id) {
      alert("Nenhuma coleção selecionada para atualizar!");
      return;
    }

    try {
      const response = await fetch(`https://localhost:7233/api/Collection`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: id,
          color: color,
          budget: budget,
        }),
      });

      if (response.ok) {
        alert("Coleção atualizada com sucesso!");
        setId("");
        setColor("");
        setBudget("");
      } else {
        console.error("Erro ao atualizar collection:", response.statusText);
        alert("Erro ao atualizar coleção!");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao atualizar coleção!");
    }
  };

  return (
    <>
      {modalstatus && (
        <Dialog
          open={modalstatus}
          onOpenChange={(open) => setModalstatus(open)}
        >
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-slate-950">
                Resultado da busca:
              </DialogTitle>
              <DialogDescription>
                {Array.isArray(dbdata.data) ? (
                  dbdata.data.map((item) => {
                    if (item.color === color) {
                      return (
                        <div className="text-slate-950" key={item.id}>
                          <p>ID: {item.id}</p>
                          <p>Color: {item.color}</p>
                          <p>Budget: {item.budget}</p>
                        </div>
                      );
                    }
                    return null;
                  })
                ) : (
                  <p>Loading data...</p>
                )}
              </DialogDescription>
            </DialogHeader>
            <button
              className="text-blue-600"
              onClick={() => setModalstatus(false)}
            >
              Close
            </button>
          </DialogContent>
        </Dialog>
      )}

      <div className="flex items-center justify-around">
        <Button className="mt-4 ml-5 bg-blue-600" onClick={handleNavigation}>
          Voltar
        </Button>
        <h3 className="mt-4"> Olá, bem vindo(a) {username}</h3>
        <Button className="mt-4 ml-5 bg-red-600" onClick={handleFinishSession}>
          Encerrar sessão
        </Button>
      </div>

      <div className="flex justify-center mt-10">
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg border border-gray-700"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="flex justify-between items-center p-4 bg-gray-700 rounded-t-lg hover:bg-gray-600 transition-colors duration-200 text-lg text-white font-semibold">
              Collection
            </AccordionTrigger>
            <AccordionContent className="flex items-center justify-center mt-5">
              <Tabs defaultValue="createCollection" className="w-[90%]">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="createCollection">Criar</TabsTrigger>
                  <TabsTrigger value="updateCollection">Atualizar</TabsTrigger>
                  <TabsTrigger value="deleteCollection">Deletar</TabsTrigger>
                  <TabsTrigger value="findCollection">Buscar</TabsTrigger>
                </TabsList>
                <TabsContent value="createCollection">
                  <Card>
                    <CardHeader>
                      <CardTitle>Criar Collection</CardTitle>
                      <CardDescription>
                        Digite os campos corretamente para criar uma coleção.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="color">Cor</Label>
                        <Input
                          id="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="budget">Budget</Label>
                        <Input
                          id="budget"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleCreateCollectionSubmit}>
                        Salvar
                      </Button>{" "}
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="updateCollection">
                  <Card>
                    <CardHeader>
                      <CardTitle>Atualizar Collection</CardTitle>
                      <CardDescription>
                        Digite o ID corretamente para atualizar uma coleção.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="color">Id</Label>
                        <Input
                          id="id"
                          value={id}
                          onChange={(e) => setId(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="color">Cor</Label>
                        <Input
                          id="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="budget">Budget</Label>
                        <Input
                          id="budget"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleUpdateCollectionSubmit}>Atualizar</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="deleteCollection">
                  <Card>
                    <CardHeader>
                      <CardTitle>Deletar Collection</CardTitle>
                      <CardDescription>
                        Para apagar um collection, digite o ID da mesma:
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="color">Id</Label>
                        <Input
                          id="id"
                          value={id}
                          onChange={(e) => setId(e.target.value)}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleDeleteCollectionSubmit}>
                        Buscar
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="findCollection">
                  <Card>
                    <CardHeader>
                      <CardTitle>Buscar Collection</CardTitle>
                      <CardDescription>
                        Para buscar uma collection, digite a cor e budget:
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="color">Cor</Label>
                        <Input
                          id="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="budget">Budget</Label>
                        <Input
                          id="budget"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={handleGetCollectionSubmit}>
                        Buscar
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="flex justify-between items-center p-4 bg-gray-700 rounded-t-lg hover:bg-gray-600 transition-colors duration-200 text-lg text-white font-semibold">
              Guns
            </AccordionTrigger>
            <AccordionContent className="flex items-center justify-center mt-5">
              <Tabs defaultValue="createGun" className="w-[90%]">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="createGun">Criar</TabsTrigger>
                  <TabsTrigger value="updateGun">Atualizar</TabsTrigger>
                  <TabsTrigger value="deleteGun">Deletar</TabsTrigger>
                  <TabsTrigger value="findGun">Buscar</TabsTrigger>
                </TabsList>
                <TabsContent value="createGun">
                  <Card>
                    <CardHeader>
                      <CardTitle>Criar Arma</CardTitle>
                      <CardDescription>
                        Digite os campos corretamente para criar uma arma.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="type">Tipo</Label>
                        <Input id="type" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="quality">Quality</Label>
                        <Input id="quality" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="class">Classe</Label>
                        <Input id="class" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="condition">Condição</Label>
                        <Input id="condition" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="mainColor">Cor principal</Label>
                        <Input id="mainColor" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="averagePrice">Preço médio</Label>
                        <Input id="averagePrice" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="image">Image</Label>
                        <Input id="image" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Salvar</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="updateGun">
                  <Card>
                    <CardHeader>
                      <CardTitle>Atualizar Arma</CardTitle>
                      <CardDescription>
                        Digite o ID da arma, após buscar na outra aba.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="id">Id</Label>
                        <Input id="id" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Atualizar</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="deleteGun">
                  <Card>
                    <CardHeader>
                      <CardTitle>Deletar Arma</CardTitle>
                      <CardDescription>
                        Para apagar uma arma, digite o ID da mesma:
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="id">Id</Label>
                        <Input id="id" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Deletar</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="findGun">
                  <Card>
                    <CardHeader>
                      <CardTitle>Buscar Arma</CardTitle>
                      <CardDescription>
                        Para buscar uma arma, insira o nome:
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        <Label htmlFor="color">Nome</Label>
                        <Input id="color" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Buscar</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
