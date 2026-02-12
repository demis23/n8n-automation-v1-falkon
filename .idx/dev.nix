# Config for Project IDX
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.docker
    pkgs.docker-compose
  ];

  # Enable Docker service in the workspace
  services.docker.enable = true;

  # IDX specific configuration
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "usernamehw.errorlens"
    ];

    # Enable previews
    previews = {
      enable = true;
      previews = {
        # This defines a preview that exposes the n8n port
        web = {
          command = ["docker-compose" "up"];
          manager = "web";
          env = {
            PORT = "5678";
          };
        };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Example: install npm dependencies if you had a package.json
        # npm-install = "npm install";
      };
      
      # Runs when the workspace is (re)started
      onStart = {
        # Automatically ensure docker compose is up using the preview command instead
        # or we could put "docker-compose up -d" here.
      };
    };
  };
}
