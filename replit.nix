{ pkgs }: {
  deps = [
    pkgs.lsof
    pkgs.unzip
    pkgs.nodejs-18_x
    pkgs.bashInteractive
    pkgs.nodePackages.bash-language-server
    pkgs.man
  ];
}