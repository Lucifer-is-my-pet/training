use strict;
use warnings;
use File::Find;

my $compressor = 'c:\Downloads\yuicompressor-2.4.8\yuicompressor-2.4.8.jar';

sub concatAndCompress {
    my $extension = shift;
    my $bundledFile = 'bundle.' . $extension;
    my @fileList = ();
    find (sub {
            if ($_ =~ /(.+\.$extension)/) {
            push @fileList, $File::Find::name;
        }
        }, $extension);

    my $out = '';

    for my $file(@fileList) {
        open my $text, "<", $file or die "Could not open file $file : $!";

        while (my $line = <$text>) {
          $out .= $line;
        }
        $out .= "\n";
    }

    open my $output, '>', $bundledFile;
    print {$output} $out;

    my $compressed = `java -jar $compressor $bundledFile`;
    return $compressed;
}

my $compressedJS = concatAndCompress('js');
my $compressedCSS = concatAndCompress('css');

local $/ = undef;

open my $input, '<', 'Click-click.html' or die "Could not open file 'Click-click.html' : $!";
open my $output, '>', 'bundle.html';

my $html = <$input>;
$html =~ s%(.*<script.+/script>\n|.*<link.+>\n)%%mg;
my $style = "<style>" . $compressedCSS . "</style>\n";
my $script = "<script>" . $compressedJS . "</script>\n";
$html =~s%</head>%$style$script</head>%;
print {$output} $html;