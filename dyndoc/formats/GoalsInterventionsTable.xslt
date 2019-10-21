<?xml version="1.0" encoding="UTF-8"?>
<?dynamic-document type="format" version="7.0"?>

<xsl:stylesheet version="2.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:cdocfx="urn:com-cerner-physician-documentation-functions"
    xmlns:n="urn:com-cerner-patient-ehr:v3"
    xmlns:dd="DynamicDocumentation"
    xmlns:goalfx="urn:com-cerner-physician-documentation-goals-functions"
    xmlns:xr-date-formatter="java:com.cerner.xsl.util.XSLTDateUtilities"
    exclude-result-prefixes="xsl xs fn cdocfx n dd xr-date-formatter goalfx">

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>
    <xsl:param as="xs:string" name="current-locale" select="'en_US'"/>

    <!-- Comment this line to debug--><xsl:include href="/cernerbasiccontent/formats/commonfxn.xslt"/>
    <!-- Uncomment this line to debug <xsl:include href="commonfxn.xslt" />-->

    <!-- Comment this line to debug--><xsl:include href="/cernerbasiccontent/formats/goalscommon.xslt"/>
    <!-- Uncomment this line to debug <xsl:include href="goalscommon.xslt" />-->

    <!-- Comment this line to debug--><xsl:include href="/cernerbasiccontent/formats/tablecommon.xslt"/>
    <!-- Uncomment this line to debug <xsl:include href="tablecommon.xslt" />-->

    <!-- Comment this line to debug--><xsl:include href="/cernerbasiccontent/formats/emrinfocommon.xslt"/>
    <!--Uncomment this line to debug <xsl:include href="emrinfocommon.xslt" />-->

    <xsl:variable name="interventionHeading" as="xs:string" select="'Intervention Description'"/>
    <xsl:variable name="categoryHeading" as="xs:string" select="'Category'"/>
    <xsl:variable name="typeHeading" as="xs:string" select="'Type/Source'"/>
    <xsl:variable name="startHeading" as="xs:string" select="'Start Date'"/>
    <xsl:variable name="isMetHeading" as="xs:string" select="'Status'"/>
    <xsl:variable name="metDisplay" as="xs:string" select="'Met'"/>
    <xsl:variable name="notMetDisplay" as="xs:string" select="'Not Met'"/>

    <xsl:variable name="DATE_ONLY_SEQUENCE" as="xs:string" select="'MM/dd/yyyy'"/>

    <xsl:template match="/">
        <xsl:if test="n:report/n:clinical-data/n:goal-data/n:goal/n:intervention">

            <xsl:call-template name="emitTableStart">
                <xsl:with-param name="retainRowsInPlainText" select="true()"/>
            </xsl:call-template>

            <xsl:call-template name="emitHeadingStart">
                <xsl:with-param name="repeatHeadingOnPrintedPages" select="true()"/>
            </xsl:call-template>

            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$interventionHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$categoryHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$typeHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$startHeading"/></xsl:call-template>
            <xsl:call-template name="emitSingleHeader"><xsl:with-param name="colName" select="$isMetHeading"/></xsl:call-template>
            <xsl:call-template name="emitHeadingEnd"/>

            <tbody>
                <!-- Reuse logic in GoalsCommon to bucket and sort goals, then calls displayGoal below -->
                <xsl:call-template name="emitGoals"/>
            </tbody>

            <xsl:call-template name="emitTableEnd"/>

        </xsl:if>
    </xsl:template>

    <!-- Called from emitGoals in GoalsCommon.xslt, assume a goal element in context -->
    <xsl:template name="displayGoal">

        <xsl:if test="n:intervention">

            <!-- Iterate through each intervention and sort by priority. 'Not Met' status goals are displayed
                first so we find all interventions with is-met=false. -->
            <xsl:for-each select="n:intervention[@is-met!='true']">
                <xsl:sort select="@priority"/>

                <xsl:if test="n:start-dt-tm/text() &lt;= $lCurrentDateTime">
                    <xsl:call-template name="displayIntervention"/>
                </xsl:if>
            </xsl:for-each>

            <!--Iterate through each intervention and sort them by update-dt-tm ascending. 'Met' status interventions
                are displayed next, so we find all goals with is-met=true. -->
            <xsl:for-each select="n:intervention[@is-met='true']">
                <xsl:sort select="n:update-dt-tm/text()" order="descending"/>

                <xsl:call-template name="displayIntervention"/>
            </xsl:for-each>

            <!--Iterate through each intervention and sort them by start-dt-tm. Future goals are displayed
                next, so we find all goals with start-dt-time >= the current datetime -->
            <xsl:for-each select="n:intervention">
                <xsl:sort select="n:start-dt-tm/text()"/>

                <xsl:if test="n:start-dt-tm &gt; $lCurrentDateTime">
                    <xsl:call-template name="displayIntervention"/>
                </xsl:if>
            </xsl:for-each>
        </xsl:if>
    </xsl:template>

    <xsl:template name="displayIntervention">
        <xsl:if test="@description != ''">

            <tr class="ddemrcontentitem ddremovable" style="page-break-inside: avoid;" dd:btnfloatingstyle="top-right">

                <xsl:if test="../@id">
                    <xsl:attribute name="dd:entityid">
                        <xsl:value-of select="../@id"/>
                    </xsl:attribute>
                </xsl:if>

                <xsl:attribute name="dd:contenttype">
                    <xsl:text>GOALS</xsl:text>
                </xsl:attribute>

                <xsl:variable name="isMetDisplay" as="xs:string">
                    <xsl:choose>
                        <xsl:when test="@is-met = true()"><xsl:value-of select="$metDisplay"/></xsl:when>
                        <xsl:otherwise><xsl:value-of select="$notMetDisplay"/></xsl:otherwise>
                    </xsl:choose>
                </xsl:variable>

                <!-- Emit goal intervention description -->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="@description != ''">
                    <xsl:call-template name="emitEmrInfoWithEntityId">
                        <xsl:with-param name="InfoType" select="'GL_INTERV_DISP_RENDER'"/>
                        <xsl:with-param name="EntityId" select="@id"/>
                        <xsl:with-param name="Content" select="@description"/>
                    </xsl:call-template>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!-- Emit goal intervention category -->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="n:category-code">
                    <xsl:value-of select="cdocfx:getCodeDisplayByID(n:category-code)"/>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!-- Emit goal intervention type -->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="n:type-code">
                    <xsl:value-of select="cdocfx:getCodeDisplayByID(n:type-code)"/>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!-- Emit goal intervention start date -->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="n:start-dt-tm">
                    <xsl:value-of select="cdocfx:getFormattedDateTime(n:start-dt-tm, $DATE_ONLY_SEQUENCE)"/>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

                <!-- Emit whether goal intervention is met or not -->
                <xsl:call-template name="emitTableCellStart"/>
                <xsl:if test="@is-met">
                    <xsl:value-of select="$isMetDisplay"/>
                </xsl:if>
                <xsl:call-template name="emitTableCellEnd"/>

            </tr>

        </xsl:if>
    </xsl:template>

</xsl:stylesheet>
