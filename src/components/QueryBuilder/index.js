import { Fragment, useEffect, useMemo, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { MdDelete } from "react-icons/md";
import { BiCog } from "react-icons/bi";
import clsx from "clsx";
import { useSearchParams } from "react-router-dom";
import {
  createSavedQuery,
  deleteSavedQuery,
  getAllSavedQueries,
  getConfigsByQuery,
  updateSavedQuery
} from "../../api/services/configs";
import { Modal } from "../Modal";
import { toastError, toastSuccess } from "../Toast/toast";
import { useLoader } from "../../hooks";
import { TextInputClearable } from "../TextInputClearable";
import { TextWithDivider } from "../TextWithDivider";

export const QueryBuilder = ({ refreshConfigs, className, ...props }) => {
  const [params, setParams] = useSearchParams();
  const query = params.get("query") || "";
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [queryList, setQueryList] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [savedQueryValue, setSavedQueryValue] = useState("");
  const { loading, setLoading } = useLoader();
  const optionCategories = useMemo(() => {
    const actions = [];
    const savedQueryLoadActions = [];

    if (!selectedQuery) {
      actions.push({
        id: "save",
        label: "Save",
        type: "action_save",
        context: {}
      });
    }

    if (selectedQuery) {
      actions.push({
        id: "update",
        label: "Update",
        type: "action_update",
        context: {}
      });
      actions.push({
        id: "save_as",
        label: "Save As",
        type: "action_save",
        context: {}
      });
      actions.push({
        id: "delete",
        label: "Delete",
        type: "action_delete",
        context: {}
      });
    }

    queryList.forEach((queryItem) => {
      savedQueryLoadActions.push({
        id: queryItem.id,
        label: queryItem.description,
        type: "action_saved_query",
        context: {
          ...queryItem
        }
      });
    });
    return {
      actions,
      savedQueryLoadActions
    };
  }, [queryList, selectedQuery]);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const result = await getAllSavedQueries();
      setQueryList(result?.data || []);
      setSelectedQuery(null);
    } catch (ex) {
      toastError(ex);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueries();
    if (query) {
      handleRunQuery(query);
    }
  }, []);

  const handleSearch = (query) => {
    setParams({
      query
    });
  };

  const handleQueryBuilderAction = (option) => {
    if (option.type === "action_save") {
      handleSaveQuery();
    } else if (option.type === "action_saved_query") {
      setSelectedQuery(option.context);
      setParams({
        query: option.context.query
      });
      handleRunQuery(option.context.query);
    } else if (option.type === "action_update") {
      updateQuery();
    } else if (option.type === "action_delete") {
      handleQueryDelete(selectedQuery.id);
    }
  };

  const handleSaveQuery = () => {
    setSavedQueryValue("");
    if (!query) {
      toastError("Please provide query details");
      return;
    }
    setModalIsOpen(true);
  };

  const handleRunQuery = async (queryToRun) => {
    if (!queryToRun) {
      toastError("Please provide a query before running");
      return;
    }
    refreshConfigs([]);
    try {
      const result = await getConfigsByQuery(queryToRun);
      refreshConfigs(result.data.results);
    } catch (ex) {
      toastError(ex.message);
    }
  };

  const saveQuery = async () => {
    if (!savedQueryValue) {
      toastError("Please provide query name");
      return;
    }
    setLoading(true);
    try {
      await createSavedQuery(query, { description: savedQueryValue });
      toastSuccess(`${savedQueryValue || query} saved successfully`);
      await fetchQueries();
    } catch (ex) {
      toastError(ex);
    }
    setModalIsOpen(false);
    setLoading(false);
  };

  const updateQuery = async () => {
    if (!query) {
      toastError("Please provide query");
      return;
    }
    setLoading(true);
    try {
      await updateSavedQuery(selectedQuery.id, { query });
      toastSuccess(
        `${selectedQuery.description || query} updated successfully`
      );
      await fetchQueries();
    } catch (ex) {
      toastError(ex);
    }
    setModalIsOpen(false);
    setLoading(false);
  };

  const handleQueryDelete = async (queryId) => {
    const query = queryList.find((o) => o.id === queryId);
    const queryName = query?.description || query?.query;
    setLoading(true);
    try {
      const res = await deleteSavedQuery(queryId);
      const { status } = res;
      if (status === 200 || status === 201) {
        toastSuccess(`${queryName} deleted successfully`);
        await fetchQueries();
        setSelectedQuery();
      }
    } catch (ex) {
      toastError(ex);
    }
    setLoading(false);
  };

  return (
    <div className={clsx("flex flex-col", className)} {...props}>
      <div className="flex">
        <TextInputClearable
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="sm:text-sm border-gray-300"
          placeholder="Search configs by using custom queries written here"
          onSubmit={(e) => handleRunQuery(query)}
          style={{ width: "750px" }}
          onClear={(e) => {
            setSelectedQuery();
            setParams({});
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRunQuery(query);
            }
          }}
        />
        <QueryBuilderActionMenu
          optionCategories={optionCategories}
          onOptionClick={handleQueryBuilderAction}
        />
      </div>
      <Modal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        title="Save Current Query"
        size="small"
      >
        <div className="flex flex-col pt-5 pb-3 max-w-lg" style={{}}>
          <input
            type="text"
            defaultValue={savedQueryValue}
            className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-400 block py-2 sm:text-sm border-gray-300 rounded-md mr-2 mb-2"
            style={{ minWidth: "300px" }}
            placeholder="Query name"
            onChange={(e) => setSavedQueryValue(e.target.value)}
          />
          <div className="flex justify-end mt-3">
            <button
              className={`border border-gray-300 rounded-md px-3 py-2 text-sm whitespace-nowrap bg-indigo-700 text-gray-50 cursor-pointer}`}
              type="button"
              onClick={() => saveQuery()}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

function QueryBuilderActionMenu({ onOptionClick, optionCategories }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex justify-center w-full p-3 bg-white text-sm font-medium text-gray-700">
        <BiCog className="content-center" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <TextWithDivider
            className="text-gray-500 text-md font-semibold"
            text="Actions"
          />
          {optionCategories.actions.map((option) => {
            return (
              <Menu.Item key={option.id}>
                {({ active }) => (
                  <div
                    className={clsx(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm",
                      "cursor-pointer"
                    )}
                    onClick={() => onOptionClick(option)}
                  >
                    {option.label}
                  </div>
                )}
              </Menu.Item>
            );
          })}
          {!!optionCategories.savedQueryLoadActions.length && (
            <TextWithDivider
              className="text-gray-500 text-md font-semibold"
              text="Saved Queries"
            />
          )}
          {optionCategories.savedQueryLoadActions.map((option) => {
            return (
              <Menu.Item key={option.id}>
                {({ active }) => (
                  <div
                    className={clsx(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm",
                      "cursor-pointer break-words"
                    )}
                    onClick={() => onOptionClick(option)}
                  >
                    {option.label}
                  </div>
                )}
              </Menu.Item>
            );
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
