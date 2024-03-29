import {
  ActionIcon,
  Button,
  Card,
  Modal,
  ScrollArea,
  Table,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Edit, Plus, Trash, X } from "tabler-icons-react";
import LayourInnerDashboard from "../../components/layouts/LayoutInnerDashboard";
import Loading from "../../components/Loading";
import { Category } from "../../interfaces/category";
import {
  useGetAllCategoriesQuery,
  useRemoveCategoryMutation,
} from "../../services/categories";

const CategoriesPage = () => {
  const {
    data: categories,
    isLoading,
    isUninitialized,
    isError,
  } = useGetAllCategoriesQuery();

  const [categoryToRemove, setCategoryToRemove] = useState<Category | null>(
    null
  );

  const [removeCategory, removed] = useRemoveCategoryMutation();

  const handleRemoveCategory = async (id: number) => {
    try {
      showNotification({
        id: "delete-category",
        loading: true,
        title: "Eliminando categoría",
        message: "Se está eliminando categoría",
        autoClose: false,
        disallowClose: true,
      });
      await removeCategory(id).unwrap();
      updateNotification({
        id: "delete-category",
        color: "teal",
        title: "Listo",
        message: "Categoria se ha elinado con éxito",
        icon: <Check />,
        autoClose: 2000,
      });
      setCategoryToRemove(null);
    } catch (err) {
      updateNotification({
        id: "delete-category",
        color: "red",
        title: "Error",
        message: "No se ha podido eliminar la categoria",
        icon: <X />,
        autoClose: 2000,
      });
    }
  };

  if (isLoading || isUninitialized) {
    return <Loading />;
  }

  if (isError) {
    return <div>"Error"</div>;
  }

  const rows = categories.map((category) => (
    <tr key={category.id}>
      <td>{category.id}</td>
      <td>{category.name}</td>
      <td>{category.description}</td>
      <td>{true ? "Sí" : "No"}</td>
      <td>
        <Link to={`/dashboard/categorias/editar/${category.id}`}>
          <ActionIcon>
            <Edit size={16} />
          </ActionIcon>
        </Link>
      </td>
      <td>
        <ActionIcon onClick={() => setCategoryToRemove(category)}>
          <Trash size={16} />
        </ActionIcon>
      </td>
    </tr>
  ));

  return (
    <LayourInnerDashboard
      title="Categorías"
      rightAction={
        <Link to={`/dashboard/categorias/editar`}>
          <Button leftIcon={<Plus size={16} />}>Agregar</Button>
        </Link>
      }
    >
      <Card style={{ maxWidth: "90vw" }} withBorder>
        <Card.Section>
          <ScrollArea>
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Activo</th>
                  <th>Editar</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </ScrollArea>
        </Card.Section>
      </Card>
      {categoryToRemove && (
        <Modal
          opened={!!categoryToRemove}
          onClose={() => setCategoryToRemove(null)}
          title={`¿Quieres eliminar ${categoryToRemove.name}?`}
        >
          <Button
            color="red"
            onClick={() => handleRemoveCategory(categoryToRemove.id)}
          >
            Eliminar
          </Button>
        </Modal>
      )}
    </LayourInnerDashboard>
  );
};

export default CategoriesPage;
