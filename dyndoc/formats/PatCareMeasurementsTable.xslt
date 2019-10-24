<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>
<xsl:stylesheet version="2.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
    xmlns:dd="DynamicDocumentation"
    exclude-result-prefixes="xsl xs fn n cdocfx">

    <!-- required to include CommonFxn.xslt -->
    <!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/patcaremeasurementcommon.xslt" /> 
    <!-- Uncomment this line to debug  <xsl:include href="patcaremeasurementcommon.xslt" /> -->
    <!-- Comment this line to debug --> <xsl:include href="/cernerbasiccontent/formats/tablemeasurementcommon.xslt" />
    <!-- Uncomment this line to debug  <xsl:include href="tablemeasurementcommon.xslt" /> --> 

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>
    
    <xsl:variable name="ColumnHeadingOne" as="xs:string">
        <xsl:value-of select="'Result Name'"/>
    </xsl:variable>
    
    <xsl:variable name="ColumnHeadingTwo" as="xs:string">
        <xsl:value-of select="'Value'"/>
    </xsl:variable>
    
    <xsl:variable name="ColumnHeadingThree" as="xs:string">
        <xsl:value-of select="'Comments'"/>
    </xsl:variable>

    <xsl:variable name="ShowComments" as="xs:boolean">
        <xsl:value-of select="true()"/>
    </xsl:variable>

    <!-- main template -->
    <xsl:template match="/">
        <xsl:variable name="measurements">
            <xsl:apply-templates select="n:report/n:clinical-data/n:patient-care-measurement-data/n:task-completion" mode="preprocessing"/>
        </xsl:variable>
        
        <xsl:variable name="commentColHeading" as="xs:string" select="if(($measurements/measurement/@column-three) and $ShowComments)  then $ColumnHeadingThree else ''"/>
 
        <xsl:variable name="sortedMeasurements">
            <xsl:for-each select="$measurements/measurement">
                <xsl:sort select="@column-one" order="ascending"/>
                <xsl:copy-of select="."/>
            </xsl:for-each>
        </xsl:variable>

        <xsl:if test="$sortedMeasurements">
            <xsl:call-template name="tempMeasurementsTable">
                <xsl:with-param name="measurements" select="$sortedMeasurements"/>
                <xsl:with-param name="colHeadingOne" select="$ColumnHeadingOne"/>
                <xsl:with-param name="colHeadingTwo" select="$ColumnHeadingTwo"/>
                <xsl:with-param name="colHeadingThree" select="$commentColHeading"/>
                <xsl:with-param name="colHeadingFour" select="''"/>
            </xsl:call-template>
        </xsl:if>
    </xsl:template>
</xsl:stylesheet>
