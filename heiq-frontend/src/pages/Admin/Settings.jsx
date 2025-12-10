import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../theme/colors";
import AdminLayout from "../../components/layout/AdminLayout";
import BackButton from "../../components/layout/BackButton";
import { Button, Card, Form, Table, Modal, Badge } from "react-bootstrap";
import { roleAPI } from "../../services/api";
import Tabs from "../../components/ui/Tabs";

const Settings = () => {
  const { isDark } = useTheme();
  const themeColors = isDark ? colors.dark : colors.light;
  const [activeTab, setActiveTab] = useState("Roles");
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [editingPermission, setEditingPermission] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [roleFormData, setRoleFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    permissions: [],
  });

  const [permissionFormData, setPermissionFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    category: "general",
  });

  // Fetch roles
  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await roleAPI.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      alert("Failed to load roles");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch permissions
  const fetchPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await roleAPI.getAllPermissions();
      setPermissions(data);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      alert("Failed to load permissions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  // Handle role form submit
  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Normalize role name to uppercase
      const normalizedName = roleFormData.name.toUpperCase().trim();
      
      if (!normalizedName) {
        alert("Role name is required");
        return;
      }

      if (editingRole) {
        await roleAPI.updateRole(editingRole._id, {
          displayName: roleFormData.displayName,
          description: roleFormData.description,
          permissions: selectedPermissions,
        });
      } else {
        await roleAPI.createRole({
          name: normalizedName,
          displayName: roleFormData.displayName,
          description: roleFormData.description,
          permissions: selectedPermissions,
        });
      }
      setShowRoleModal(false);
      setEditingRole(null);
      setRoleFormData({ name: "", displayName: "", description: "", permissions: [] });
      setSelectedPermissions([]);
      fetchRoles();
    } catch (error) {
      console.error("Failed to save role:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to save role";
      alert(errorMessage);
    }
  };

  // Handle permission form submit
  const handlePermissionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPermission) {
        await roleAPI.updatePermission(editingPermission._id, permissionFormData);
      } else {
        await roleAPI.createPermission(permissionFormData);
      }
      setShowPermissionModal(false);
      setEditingPermission(null);
      setPermissionFormData({ name: "", displayName: "", description: "", category: "general" });
      fetchPermissions();
    } catch (error) {
      console.error("Failed to save permission:", error);
      alert(error.response?.data?.message || "Failed to save permission");
    }
  };

  // Open role edit modal
  const handleEditRole = (role) => {
    if (showRoleModal) return; // Prevent double opening
    setEditingRole(role);
    setRoleFormData({
      name: role.name,
      displayName: role.displayName,
      description: role.description || "",
      permissions: role.permissions || [],
    });
    setSelectedPermissions(role.permissions || []);
    setShowRoleModal(true);
  };

  // Open role create modal
  const handleCreateRole = () => {
    if (showRoleModal) return; // Prevent double opening
    setEditingRole(null);
    setRoleFormData({ name: "", displayName: "", description: "", permissions: [] });
    setSelectedPermissions([]);
    setShowRoleModal(true);
  };

  // Open permission edit modal
  const handleEditPermission = (permission) => {
    if (showPermissionModal) return; // Prevent double opening
    setEditingPermission(permission);
    setPermissionFormData({
      name: permission.name,
      displayName: permission.displayName,
      description: permission.description || "",
      category: permission.category || "general",
    });
    setShowPermissionModal(true);
  };

  // Open permission create modal
  const handleCreatePermission = () => {
    if (showPermissionModal) return; // Prevent double opening
    setEditingPermission(null);
    setPermissionFormData({ name: "", displayName: "", description: "", category: "general" });
    setShowPermissionModal(true);
  };

  // Delete role
  const handleDeleteRole = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await roleAPI.deleteRole(id);
        fetchRoles();
      } catch (error) {
        console.error("Failed to delete role:", error);
        alert("Failed to delete role");
      }
    }
  };

  // Delete permission
  const handleDeletePermission = async (id) => {
    if (window.confirm("Are you sure you want to delete this permission?")) {
      try {
        await roleAPI.deletePermission(id);
        fetchPermissions();
      } catch (error) {
        console.error("Failed to delete permission:", error);
        alert("Failed to delete permission");
      }
    }
  };

  // Toggle permission selection
  const togglePermission = (permissionName) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionName)
        ? prev.filter((p) => p !== permissionName)
        : [...prev, permissionName]
    );
  };

  return (
    <AdminLayout>
      <BackButton label="Back" />

      <div className="mt-4">
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 600,
            marginBottom: "20px",
            color: themeColors.text,
          }}
        >
          Settings - Roles & Permissions
        </h1>

        <Tabs
          active={activeTab}
          setActive={setActiveTab}
          tabs={["Roles", "Permissions"]}
        />

        {/* Roles Tab */}
        {activeTab === "Roles" && (
          <Card
            className="mt-4"
            style={{
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            }}
          >
            <Card.Header
              style={{
                backgroundColor: themeColors.background,
                borderColor: themeColors.border,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5 style={{ color: themeColors.text, margin: 0 }}>Roles Management</h5>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateRole();
                }}
                style={{
                  backgroundColor: colors.primaryGreen,
                  borderColor: colors.primaryGreen,
                  color: "#ffffff",
                }}
              >
                + Add Role
              </Button>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-4" style={{ color: themeColors.textSecondary }}>
                  Loading...
                </div>
              ) : (
                <Table
                  bordered
                  hover
                  style={{
                    backgroundColor: themeColors.surface,
                    color: themeColors.text,
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: themeColors.background }}>
                      <th style={{ color: themeColors.text }}>Name</th>
                      <th style={{ color: themeColors.text }}>Display Name</th>
                      <th style={{ color: themeColors.text }}>Permissions</th>
                      <th style={{ color: themeColors.text }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => (
                      <tr key={role._id}>
                        <td style={{ color: themeColors.text }}>{role.name}</td>
                        <td style={{ color: themeColors.text }}>{role.displayName}</td>
                        <td>
                          {role.permissions?.slice(0, 3).map((perm) => (
                            <Badge key={perm} className="me-1" bg="secondary">
                              {perm}
                            </Badge>
                          ))}
                          {role.permissions?.length > 3 && (
                            <Badge bg="secondary">+{role.permissions.length - 3}</Badge>
                          )}
                        </td>
                        <td>
                          <Button
                            variant="info"
                            size="sm"
                            className="me-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditRole(role);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteRole(role._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Permissions Tab */}
        {activeTab === "Permissions" && (
          <Card
            className="mt-4"
            style={{
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            }}
          >
            <Card.Header
              style={{
                backgroundColor: themeColors.background,
                borderColor: themeColors.border,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5 style={{ color: themeColors.text, margin: 0 }}>Permissions Management</h5>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreatePermission();
                }}
                style={{
                  backgroundColor: colors.primaryGreen,
                  borderColor: colors.primaryGreen,
                  color: "#ffffff",
                }}
              >
                + Add Permission
              </Button>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-4" style={{ color: themeColors.textSecondary }}>
                  Loading...
                </div>
              ) : (
                <Table
                  bordered
                  hover
                  style={{
                    backgroundColor: themeColors.surface,
                    color: themeColors.text,
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: themeColors.background }}>
                      <th style={{ color: themeColors.text }}>Name</th>
                      <th style={{ color: themeColors.text }}>Display Name</th>
                      <th style={{ color: themeColors.text }}>Category</th>
                      <th style={{ color: themeColors.text }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((permission) => (
                      <tr key={permission._id}>
                        <td style={{ color: themeColors.text }}>{permission.name}</td>
                        <td style={{ color: themeColors.text }}>{permission.displayName}</td>
                        <td style={{ color: themeColors.text }}>{permission.category}</td>
                        <td>
                          <Button
                            variant="info"
                            size="sm"
                            className="me-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPermission(permission);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeletePermission(permission._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        )}
      </div>

      {/* Role Modal */}
      <Modal
        show={showRoleModal}
        onHide={(e) => {
          // Prevent double closing
          if (e && e.stopPropagation) e.stopPropagation();
          setShowRoleModal(false);
          setEditingRole(null);
          setRoleFormData({ name: "", displayName: "", description: "", permissions: [] });
          setSelectedPermissions([]);
        }}
        centered
        backdrop="static"
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
          }}
        >
          <Modal.Title style={{ color: themeColors.text }}>
            {editingRole ? "Edit Role" : "Add New Role"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: themeColors.surface }}>
          <Form onSubmit={handleRoleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Role Name</Form.Label>
              <Form.Control
                type="text"
                value={roleFormData.name}
                onChange={(e) =>
                  setRoleFormData({ ...roleFormData, name: e.target.value.toUpperCase().replace(/\s/g, "_") })
                }
                disabled={!!editingRole}
                required
                style={{
                  backgroundColor: themeColors.inputBackground,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                }}
              />
              <Form.Text style={{ color: themeColors.textSecondary }}>
                Use uppercase with underscores (e.g., JOB_SEEKER)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Display Name</Form.Label>
              <Form.Control
                type="text"
                value={roleFormData.displayName}
                onChange={(e) =>
                  setRoleFormData({ ...roleFormData, displayName: e.target.value })
                }
                required
                style={{
                  backgroundColor: themeColors.inputBackground,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={roleFormData.description}
                onChange={(e) =>
                  setRoleFormData({ ...roleFormData, description: e.target.value })
                }
                style={{
                  backgroundColor: themeColors.inputBackground,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Permissions</Form.Label>
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: "4px",
                  padding: "10px",
                  backgroundColor: themeColors.inputBackground,
                }}
              >
                {permissions.map((permission) => (
                  <Form.Check
                    key={permission._id}
                    type="checkbox"
                    label={permission.displayName}
                    checked={selectedPermissions.includes(permission.name)}
                    onChange={() => togglePermission(permission.name)}
                    style={{ color: themeColors.text }}
                  />
                ))}
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowRoleModal(false);
                  setEditingRole(null);
                  setRoleFormData({ name: "", displayName: "", description: "", permissions: [] });
                  setSelectedPermissions([]);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{
                  backgroundColor: colors.primaryGreen,
                  borderColor: colors.primaryGreen,
                  color: "#ffffff",
                }}
              >
                {editingRole ? "Update" : "Create"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Permission Modal */}
      <Modal
        show={showPermissionModal}
        onHide={(e) => {
          // Prevent double closing
          if (e && e.stopPropagation) e.stopPropagation();
          setShowPermissionModal(false);
          setEditingPermission(null);
          setPermissionFormData({ name: "", displayName: "", description: "", category: "general" });
        }}
        centered
        backdrop="static"
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
          }}
        >
          <Modal.Title style={{ color: themeColors.text }}>
            {editingPermission ? "Edit Permission" : "Add New Permission"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: themeColors.surface }}>
          <Form onSubmit={handlePermissionSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Permission Name</Form.Label>
              <Form.Control
                type="text"
                value={permissionFormData.name}
                onChange={(e) =>
                  setPermissionFormData({
                    ...permissionFormData,
                    name: e.target.value.toLowerCase().replace(/\s/g, "_"),
                  })
                }
                disabled={!!editingPermission}
                required
                style={{
                  backgroundColor: themeColors.inputBackground,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                }}
              />
              <Form.Text style={{ color: themeColors.textSecondary }}>
                Use lowercase with underscores (e.g., create_user)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Display Name</Form.Label>
              <Form.Control
                type="text"
                value={permissionFormData.displayName}
                onChange={(e) =>
                  setPermissionFormData({
                    ...permissionFormData,
                    displayName: e.target.value,
                  })
                }
                required
                style={{
                  backgroundColor: themeColors.inputBackground,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={permissionFormData.description}
                onChange={(e) =>
                  setPermissionFormData({
                    ...permissionFormData,
                    description: e.target.value,
                  })
                }
                style={{
                  backgroundColor: themeColors.inputBackground,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: themeColors.text }}>Category</Form.Label>
              <Form.Select
                value={permissionFormData.category}
                onChange={(e) =>
                  setPermissionFormData({
                    ...permissionFormData,
                    category: e.target.value,
                  })
                }
                style={{
                  backgroundColor: themeColors.inputBackground,
                  color: themeColors.text,
                  borderColor: themeColors.border,
                }}
              >
                <option value="general">General</option>
                <option value="user">User Management</option>
                <option value="content">Content Management</option>
                <option value="listmanagement">List Management</option>
                <option value="ticket">Ticket Management</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowPermissionModal(false);
                  setEditingPermission(null);
                  setPermissionFormData({ name: "", displayName: "", description: "", category: "general" });
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{
                  backgroundColor: colors.primaryGreen,
                  borderColor: colors.primaryGreen,
                  color: "#ffffff",
                }}
              >
                {editingPermission ? "Update" : "Create"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
};

export default Settings;

